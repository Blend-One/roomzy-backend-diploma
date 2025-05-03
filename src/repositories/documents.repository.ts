import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Rent, Room } from '@prisma/client';
import { DocumentStatus } from '../models/enums/document-status.enum';
import { v4 } from 'uuid';
import { documentXMLTemplate, DocumentTemplateProps } from '../templates/document.template';
import { xmlToBase64 } from '../utils/document.utils';

@Injectable()
export default class DocumentsRepository {
    constructor(private prisma: PrismaService) {}

    public getDocumentById(documentId: string) {
        return this.prisma.document.findUnique({
            where: {
                id: documentId,
            },
            include: {
                rent: {
                    select: {
                        id: true,
                        userId: true,
                        room: {
                            select: {
                                id: true,
                                userId: true,
                            },
                        },
                    },
                },
            },
        });
    }

    public createDocument(
        rent: Rent & { room: Room & { roomType: { ru: string } } },
        templateData: DocumentTemplateProps,
    ) {
        const xml = documentXMLTemplate(templateData);
        const base64Xml = xmlToBase64(xml);

        return this.prisma.document.create({
            data: {
                xml,
                base64Xml,
                createdDate: templateData.createdDate,
                id: v4(),
                status: DocumentStatus.CREATED,
                rent: {
                    connect: {
                        id: rent.id,
                    },
                },
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
