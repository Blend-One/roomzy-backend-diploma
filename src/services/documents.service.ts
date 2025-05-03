import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import DocumentsRepository from '../repositories/documents.repository';
import { DocumentSignRequestDto } from '../models/requests-schemas/document.request';
import { NcaNodeService } from './nca-node.service';
import { DOCUMENTS_ERRORS } from '../errors/documents.errors';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { DocumentStatus } from '../models/enums/document-status.enum';
import { RoomStatus } from '../models/enums/room-status.enum';
import RentRepository from '../repositories/rent.repository';
import { RoomRepository } from '../repositories/room.repository';
import { RentStatus } from '../models/enums/rent-status.enum';
import { htmlToPdf } from '../utils/html-pdf.utils';
import { documentHTMLTemplate, DocumentTemplateProps } from '../templates/document.template';
import * as dayjs from 'dayjs';
import { Response } from 'express';
import { Rent, Room } from '@prisma/client';

type DocumentNewData = [DocumentStatus, DocumentStatus, (iin: string, commonName: string) => any];

@Injectable()
export default class DocumentsService {
    constructor(
        private documentsRepository: DocumentsRepository,
        private ncaNodeService: NcaNodeService,
        private rentRepository: RentRepository,
        private roomRepository: RoomRepository,
    ) {}

    private TEMPLATE_DATE_FORMAT = 'M/D/YYYY h:mm A';

    public createDataForTemplate(rent: Rent & { room: Room & { roomType: { ru: string } } }): DocumentTemplateProps {
        const createdDate = new Date().toISOString();
        return {
            issuedDate: dayjs(rent.issuedDate).format(this.TEMPLATE_DATE_FORMAT),
            id: rent.id,
            dueDate: dayjs(rent.dueDate).format(this.TEMPLATE_DATE_FORMAT),
            createdDate,
            amount: rent.totalPrice.toNumber(),
            deposit: rent.room.hasDeposit ? rent.room.price.toNumber() : undefined,
            address: [rent.room.street, rent.room.building, rent.room.appartment].filter(Boolean).join(' '),
            roomType: rent.room.roomType.ru,
            area: String(rent.room.square),
        };
    }

    public async getPDFDocument(documentId: string, userId: string, res: Response) {
        const document = await this.documentsRepository.getDocumentById(documentId);

        if (!document || ![document.rent.userId, document.rent.room.userId].includes(userId)) {
            throw new BadRequestException(DOCUMENTS_ERRORS.DOCUMENT_NOT_FOUND);
        }

        const rent = await this.rentRepository.getRentById(document.rent.id);

        const dataForTemplate = this.createDataForTemplate(rent);

        const html = documentHTMLTemplate(dataForTemplate);

        return htmlToPdf(html, rent.room.title, res);
    }

    public async getDocument(documentId: string, userId: string) {
        const document = await this.documentsRepository.getDocumentById(documentId);

        if (!document || ![document.rent.userId, document.rent.room.userId].includes(userId)) {
            throw new BadRequestException(DOCUMENTS_ERRORS.DOCUMENT_NOT_FOUND);
        }

        const copiedDocument = { ...document };
        delete copiedDocument['rent'];
        return copiedDocument;
    }

    public async signDocument(documentId: string, userId: string, cmsBody: DocumentSignRequestDto) {
        const document = await this.documentsRepository.getDocumentById(documentId);

        if (!document || (document && document.status === DocumentStatus.SIGNED)) {
            throw new BadRequestException(DOCUMENTS_ERRORS.DOCUMENT_NOT_FOUND);
        }

        if (![document.rent.userId, document.rent.room.userId].includes(userId)) {
            throw new BadRequestException(AUTH_ERRORS.FORBIDDEN);
        }

        const newDataMapping = new Map<boolean, DocumentNewData>([
            [
                document.rent.userId === userId,
                [
                    DocumentStatus.SIGNED_BY_LANDLORD,
                    DocumentStatus.SIGNED,
                    (iin: string, commonName: string) => ({ landlordCommonName: commonName, landlordIIN: iin }),
                ],
            ],
            [
                document.rent.room.userId === userId,
                [
                    DocumentStatus.CREATED,
                    DocumentStatus.SIGNED_BY_LANDLORD,
                    (iin: string, commonName: string) => ({ renterCommonName: commonName, renterIIN: iin }),
                ],
            ],
        ]);

        const newData = newDataMapping.get(true);

        if (document.status !== newData?.[0]) {
            throw new BadRequestException(DOCUMENTS_ERRORS.INVALID_DOCUMENT_STATUS);
        }

        const data = await this.ncaNodeService
            .verifyCms(cmsBody.cms, document.base64Xml)
            .then(data => {
                return data.blob();
            })
            .then(data => data.text())
            .then(data => JSON.parse(data));

        if (data.status !== HttpStatus.OK) {
            throw new BadRequestException(data.message);
        }

        const {
            subject: { commonName, iin },
        } = data.signers[0]?.certificates?.[0] || { subjects: {} };

        if ([document.landlordIIN, document.renterIIN].includes(iin)) {
            throw new BadRequestException(DOCUMENTS_ERRORS.INVALID_SIGNATURE);
        }

        await this.documentsRepository.changeDataForDocument(documentId, newData[1], newData[2](iin, commonName));

        if (newData[1] === DocumentStatus.SIGNED) {
            await Promise.all([
                this.roomRepository.changeAdStatus(document.rent.room.id, RoomStatus.RENTED),
                this.rentRepository.changeRentStatus({
                    rentId: document.rent.id,
                    status: RentStatus.PENDING,
                }),
            ]);
        }
        return data;
    }
}
