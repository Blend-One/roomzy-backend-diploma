import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma.service';
import { CreateRoomRequestDto, SectionRoomSchemaDto } from 'models/requests-schemas/create-ad.request';
import { RoomStatus } from 'models/enums/room-status.enum';
import { WithTransactionPrisma } from '../types/transaction-prisma.types';

@Injectable()
export class RoomRepository {
    constructor(private prisma: PrismaService) {}

    public async createAd({
        room,
        roomId,
        sections,
        transactionPrisma,
    }: WithTransactionPrisma<{
        room: Omit<CreateRoomRequestDto, 'sections'>;
        sections: SectionRoomSchemaDto;
        roomId: string;
    }>) {
        const prismaInstance = transactionPrisma ?? this.prisma;
        return prismaInstance.room.create({
            data: {
                id: roomId,
                ...(room as any),
                physControl: !!room.physControlInstructions,
                roomSections: {
                    create: sections.map(section => ({
                        floorNumber: section.floorNumber,
                        roomSectionTypeId: section.roomSectionTypeId,
                        sectionAttributeValues: {
                            create: Object.entries(section.sectionAttributeValues).map(([key, value]) => ({
                                attributeId: value as string,
                                attributeTypeId: key,
                            })),
                        },
                    })),
                },
            },
        });
    }

    public async changeAdStatus(roomId: string, status: RoomStatus) {
        return this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                status,
            },
        });
    }

    public async updateAd(roomId: string, room: Omit<CreateRoomRequestDto, 'sections'>) {
        return this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: room,
        });
    }
}
