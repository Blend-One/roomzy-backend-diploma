import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma.service';
import { CreateRoomRequestDto, SectionRoomSchemaDto } from 'models/requests-schemas/create-ad.request';
import { RoomStatus } from 'models/enums/room-status.enum';
import { WithTransactionPrisma } from '../types/transaction-prisma.types';
import { PaginatedFilters } from '../models/dtos/fitlers.dto';
import { Locale } from '../models/enums/locale.enum';
import { UpdateRoomRequestDto } from '../models/requests-schemas/update-ad.request';
import { IncludeIdToArray } from '../types/include-id-to-array.types';
import { InferArrayElement } from '../types/infer-array-element.types';

@Injectable()
export class RoomRepository {
    constructor(private prisma: PrismaService) {}

    public async createAd({
        room,
        sections,
        transactionPrisma,
        userId,
    }: WithTransactionPrisma<{
        room: Omit<Required<CreateRoomRequestDto>, 'sections'>;
        sections: SectionRoomSchemaDto;
        userId: string;
    }>) {
        const { roomTypeId, priceUnit, cityId, districtId, ...roomQuery } = room;
        const prismaInstance = transactionPrisma ?? this.prisma;
        return prismaInstance.room.create({
            data: {
                ...roomQuery,
                userRelation: {
                    connect: {
                        id: userId,
                    },
                },
                roomType: {
                    connect: {
                        id: roomTypeId,
                    },
                },
                roomStatus: {
                    connect: {
                        name: RoomStatus.IN_MODERATION,
                    },
                },
                priceUnitRelation: {
                    connect: {
                        name: priceUnit,
                    },
                },
                city: {
                    connect: {
                        id: cityId,
                    },
                },
                district: {
                    connect: {
                        id: districtId,
                    },
                },
                physControl: !!room.physControlInstructions,
                roomSections: {
                    create: sections.map(section => ({
                        floorNumber: section.floorNumber,
                        roomSectionType: {
                            connect: {
                                id: section.roomSectionTypeId,
                            },
                        },
                        sectionAttributeValues: {
                            create: Object.entries(section.sectionAttributeValues).map(([key, value]) => ({
                                characteristic: {
                                    connect: {
                                        id: key,
                                    },
                                },
                                value: value as string,
                                attribute: {
                                    connect: {
                                        id: value as string,
                                    },
                                },
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

    private getSectionAttributeValuesQueryForUpdate(section: InferArrayElement<SectionRoomSchemaDto>) {
        const characteristicIds = Object.keys(section.sectionAttributeValues);
        return {
            upsert: characteristicIds?.map(characteristicId => {
                const attributeId = section.sectionAttributeValues[characteristicId] as string;
                return {
                    where: {
                        characteristicId,
                    } as any,
                    update: {
                        attribute: {
                            connect: {
                                id: attributeId,
                            },
                        },
                        value: attributeId,
                    },
                    create: {
                        characteristic: {
                            connect: {
                                id: characteristicId,
                            },
                        },
                        attribute: {
                            connect: {
                                id: attributeId,
                            },
                        },
                        value: attributeId,
                    },
                };
            }),
            deleteMany: {
                characteristicId: {
                    notIn: characteristicIds,
                },
            },
        };
    }

    private getSectionsQueryForUpdate(sections: IncludeIdToArray<SectionRoomSchemaDto>, sectionsToDelete: string[]) {
        return {
            update: sections?.map(section => {
                return {
                    where: {
                        id: section.id,
                    },
                    data: {
                        floorNumber: section.floorNumber,
                        roomSectionType: {
                            connect: {
                                id: section.roomSectionTypeId,
                            },
                        },
                        sectionAttributeValues: this.getSectionAttributeValuesQueryForUpdate(section),
                    },
                };
            }),
            deleteMany: {
                id: {
                    in: sectionsToDelete,
                },
            },
        };
    }

    public async updateAd({
        room,
        roomId,
        userId,
        sections,
        sectionsToDelete,
        imagesToDelete,
        transactionPrisma,
    }: WithTransactionPrisma<{
        roomId: string;
        userId: string;
        room: Omit<UpdateRoomRequestDto, 'sections' | 'sectionsToDelete' | 'imagesToDelete'>;
        sections: IncludeIdToArray<SectionRoomSchemaDto>;
        sectionsToDelete: string[];
        imagesToDelete: string[];
    }>) {
        const prismaInstance = transactionPrisma ?? this.prisma;
        return prismaInstance.room.update({
            where: {
                userId,
                id: roomId,
            },
            data: {
                ...room,
                roomImages: {
                    deleteMany: {
                        id: {
                            in: imagesToDelete,
                        },
                    },
                },
                roomSections: this.getSectionsQueryForUpdate(sections, sectionsToDelete),
            },
        });
    }

    public async getRoomByUserAndRoomIds(roomId: string, userId?: string) {
        return this.prisma.room.findUnique({
            where: {
                id: roomId,
                userId,
                status: {
                    in: [RoomStatus.ARCHIVED, RoomStatus.OPENED, RoomStatus.IN_MODERATION, RoomStatus.REJECTED],
                },
            },
        });
    }

    public async getAds(filters: PaginatedFilters, status: RoomStatus, take: number, skip: number, locale: Locale) {
        return this.prisma.room.findMany({
            where: {
                roomTypeId: filters.roomTypeId,
                title: {
                    contains: filters.title,
                },
                priceUnit: filters.priceUnit,
                price: {
                    gte: filters.priceRange?.min,
                    lte: filters.priceRange?.max,
                },
                physControl: filters.physControl,
                accessInstructions: filters.accessInstructions
                    ? {
                          not: null,
                      }
                    : {},
                districtId: {
                    in: filters.districtIds,
                },
                status,
                cityId: filters.cityId,
                isCommercial: filters.isCommercial,
                square: {
                    gte: filters.square?.min,
                    lte: filters.square?.max,
                },
                roomSections: {
                    some: {
                        OR: filters.sections?.map(({ floorNumber, sectionTypeId, values }) => ({
                            floorNumber,
                            roomSectionTypeId: sectionTypeId,
                            sectionAttributeValues: {
                                every: {
                                    OR: Object.entries(values).map(([key, value]) => ({
                                        attributeId: value,
                                        characteristicId: key,
                                    })),
                                },
                            },
                        })),
                    },
                },
            },
            include: {
                roomType: {
                    select: {
                        [locale]: true,
                    },
                },
                roomImages: true,
                priceUnitRelation: true,
                district: {
                    select: {
                        [locale]: true,
                    },
                },
                city: {
                    select: {
                        [locale]: true,
                    },
                },
            },
            skip,
            take,
        });
    }
}
