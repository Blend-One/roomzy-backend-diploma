import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma.service';
import { CreateRoomRequestDto, SectionRoomSchemaDto } from 'models/requests-schemas/create-ad.request';
import { RoomStatus } from 'models/enums/room-status.enum';
import { WithTransactionPrisma } from 'types/transaction-prisma.types';
import { FiltersDto } from 'models/dtos/fitlers.dto';
import { Locale } from 'models/enums/locale.enum';
import { UpdateRoomRequestDto } from 'models/requests-schemas/update-ad.request';
import { IncludeIdToArray } from 'types/include-id-to-array.types';
import { InferArrayElement } from 'types/infer-array-element.types';

@Injectable()
export class RoomRepository {
    constructor(private prisma: PrismaService) {}

    private getQueryForSectionCreation(section: InferArrayElement<SectionRoomSchemaDto>) {
        return {
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
        };
    }

    public async createAd({
        room,
        sections,
        transactionPrisma,
        userId,
    }: WithTransactionPrisma<{
        room: Omit<Required<CreateRoomRequestDto>, 'sections' | 'defaultOptions'>;
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
                    create: sections.map(section => this.getQueryForSectionCreation(section)),
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
        const characteristicIds = section?.sectionAttributeValues?.length
            ? Object.keys(section.sectionAttributeValues)
            : [];
        /* eslint-disable indent */
        return !characteristicIds.length
            ? []
            : {
                  sectionAttributeValues: {
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
                  },
              };
        /* eslint-enable indent */
    }

    private getSectionsQueryForUpdate(sections: IncludeIdToArray<SectionRoomSchemaDto>, sectionsToDelete: string[]) {
        const query = {
            upsert: sections?.map(section => {
                return {
                    where: {
                        id: section.id,
                    },
                    update: {
                        floorNumber: section.floorNumber,
                        roomSectionTypeId: section.roomSectionTypeId,
                        ...this.getSectionAttributeValuesQueryForUpdate(section),
                    },
                    create: this.getQueryForSectionCreation(section),
                };
            }),
        };

        if (!!sectionsToDelete.length) {
            query['deleteMany'] = {
                id: {
                    in: sectionsToDelete,
                },
            };
        }

        return query;
    }

    public async updateAd({
        room,
        roomId,
        userId,
        sections,
        sectionsToDelete,
        imagesToDelete,
        transactionPrisma,
        shouldSwitchToModerationStatus,
    }: WithTransactionPrisma<{
        roomId: string;
        userId: string;
        room: Omit<UpdateRoomRequestDto, 'sections' | 'sectionsToDelete' | 'imagesToDelete'>;
        sections: IncludeIdToArray<SectionRoomSchemaDto>;
        sectionsToDelete: string[];
        imagesToDelete: string[];
        shouldSwitchToModerationStatus?: boolean;
    }>) {
        const prismaInstance = transactionPrisma ?? this.prisma;

        const query = {
            where: {
                userId,
                id: roomId,
                status: RoomStatus.OPENED,
            },
            data: {
                ...room,
                roomSections: this.getSectionsQueryForUpdate(sections, sectionsToDelete),
            },
        };

        if (shouldSwitchToModerationStatus) {
            query.data['status'] = RoomStatus.IN_MODERATION;
        }

        if (!!imagesToDelete.length) {
            query.data['roomImages'] = {
                deleteMany: {
                    id: {
                        in: imagesToDelete,
                    },
                },
            };
        }

        return prismaInstance.room.update(query);
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

    public async getAd(roomId: string, locale: Locale) {
        return this.prisma.room.findUnique({
            where: {
                id: roomId,
            },
            omit: {
                roomTypeId: true,
                districtId: true,
                cityId: true,
            },
            include: {
                roomType: {
                    select: {
                        id: true,
                        [locale]: true,
                    },
                },
                roomSections: {
                    select: {
                        floorNumber: true,
                        id: true,
                        roomSectionType: {
                            select: {
                                id: true,
                                [locale]: true,
                            },
                        },
                        sectionAttributeValues: {
                            select: {
                                id: true,
                                characteristic: {
                                    select: {
                                        id: true,
                                        [locale]: true,
                                    },
                                },
                                attribute: {
                                    select: {
                                        id: true,
                                        [locale]: true,
                                    },
                                },
                            },
                        },
                    },
                },
                roomImages: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                district: {
                    select: {
                        id: true,
                        [locale]: true,
                    },
                },
                city: {
                    select: {
                        id: true,
                        [locale]: true,
                    },
                },
            },
        });
    }

    public async getAds(
        filters: FiltersDto | null,
        status: RoomStatus,
        take: number,
        skip: number,
        locale: Locale,
        userId?: string,
    ) {
        const query = {
            where: {
                userId,
                roomTypeId: filters?.roomTypeId,
                title: {
                    contains: filters?.title,
                },
                hasDeposit: filters?.hasDeposit ?? {},
                priceUnit: filters?.priceUnit,
                price: {
                    gte: filters?.priceRange?.min,
                    lte: filters?.priceRange?.max,
                },
                physControl: filters?.physControl ?? {},
                accessInstructions: filters?.accessInstructions
                    ? {
                          not: null,
                      }
                    : {},
                districtId: {
                    in: filters?.districtIds,
                },
                status,
                cityId: filters?.cityId,
                isCommercial: filters?.isCommercial ?? {},
                square: {
                    gte: filters?.square?.min,
                    lte: filters?.square?.max,
                },
            },
            omit: {
                cityId: true,
                districtId: true,
                roomTypeId: true,
            },
            include: {
                roomType: {
                    select: {
                        id: true,
                        [locale]: true,
                    },
                },
                roomImages: true,
                district: {
                    select: {
                        id: true,
                        [locale]: true,
                    },
                },
                city: {
                    select: {
                        id: true,
                        [locale]: true,
                    },
                },
            },
            skip,
            take,
        };

        if (!!filters?.sections?.length) {
            query.where['roomSections'] = {
                some: {
                    OR: filters?.sections?.map(({ floorNumber, roomSectionTypeId, sectionAttributeValues }) => ({
                        floorNumber,
                        roomSectionTypeId: roomSectionTypeId,
                        sectionAttributeValues: !sectionAttributeValues
                            ? {}
                            : {
                                  some: {
                                      OR: Object.entries(sectionAttributeValues).map(([key, value]) => ({
                                          attributeId: value,
                                          characteristicId: key,
                                      })),
                                  },
                              },
                    })),
                },
            };
        }
        return this.prisma.room.findMany(query);
    }
}
