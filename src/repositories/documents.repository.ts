import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Rent, Room } from '@prisma/client';
import { DocumentStatus } from '../models/enums/document-status.enum';
import * as dayjs from 'dayjs';
import { v4 } from 'uuid';
import { documentXMLTemplate, DocumentTemplateProps } from '../templates/document.template';

@Injectable()
export default class DocumentsRepository {
    constructor(private prisma: PrismaService) {}

    private TEMPLATE_DATE_FORMAT = 'M/D/YYYY h:mm A';

    public getDocumentById(documentId: string) {
        return this.prisma.document.findUnique({
            where: {
                id: documentId,
            },
            include: {
                rent: {
                    select: {
                        userId: true,
                        room: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
            },
        });
    }

    public createDocument(rent: Rent & { room: Room & { roomType: { ru: string } } }) {
        const createdDate = new Date().toISOString();
        const dataForXml: DocumentTemplateProps = {
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
        return this.prisma.document.create({
            data: {
                id: v4(),
                createdDate,
                status: DocumentStatus.CREATED,
                rent: {
                    connect: {
                        id: rent.id,
                    },
                },
                xml: documentXMLTemplate(dataForXml),
            },
        });
    }

    public changeDataForDocument(
        documentId: string,
        status: DocumentStatus,
        data: { landlordCommonName: string; landlordIIN: string } | { renterCommonName: string; renterIIN: string },
    ) {
        return this.prisma.document.update({
            where: {
                id: documentId,
            },
            data: {
                ...data,
                status,
            },
        });
    }
}
