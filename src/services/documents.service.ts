import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import DocumentsRepository from '../repositories/documents.repository';
import { DocumentSignRequestDto } from '../models/requests-schemas/document.request';
import { NcaNodeService } from './nca-node.service';
import { DOCUMENTS_ERRORS } from '../errors/documents.errors';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { DocumentStatus } from '../models/enums/document-status.enum';

type DocumentNewData = [DocumentStatus, DocumentStatus, (iin: string, commonName: string) => any];

@Injectable()
export default class DocumentsService {
    constructor(
        private documentsRepository: DocumentsRepository,
        private ncaNodeService: NcaNodeService,
    ) {}

    public async signDocument(documentId: string, userId: string, cmsBody: DocumentSignRequestDto) {
        const document = await this.documentsRepository.getDocumentById(documentId);

        if (!document || (document && document.status === DocumentStatus.SIGNED)) {
            throw new BadRequestException(DOCUMENTS_ERRORS.DOCUMENT_NOT_FOUND);
        }

        if (document.rent.userId !== userId || document.rent.room.userId !== userId) {
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
                    DocumentStatus.SIGNED,
                    (iin: string, commonName: string) => ({ renterCommonName: commonName, renterIIN: iin }),
                ],
            ],
        ]);

        const newData = newDataMapping.get(true);

        if (document.status !== newData?.[0]) {
            throw new BadRequestException(DOCUMENTS_ERRORS.INVALID_DOCUMENT_STATUS);
        }

        const data = await this.ncaNodeService
            .verifyCms(cmsBody.cms, cmsBody.data)
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

        await this.documentsRepository.changeDataForDocument(documentId, newData[1], newData[2](iin, commonName));

        return data;
    }
}
