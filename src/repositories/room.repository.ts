import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma.service';
import { CreateRoomRequestDto, SectionRoomSchemaDto } from 'models/requests-schemas/create-ad.request';
import { RoomStatus } from 'models/enums/room-status.enum';

@Injectable()
export class RoomRepository {
    constructor(private prisma: PrismaService) {}

    public async createAd(
        room: Omit<CreateRoomRequestDto, 'sections'>,
        sections: SectionRoomSchemaDto,
        roomId: string,
    ) {
        return this.prisma.room.create({
            data: {
                id: roomId,
                ...(room as any),
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
