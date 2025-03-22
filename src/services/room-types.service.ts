import { Injectable } from '@nestjs/common';
import { DetailsRepository } from 'repositories/details.repository';
import { CommonRepository } from 'repositories/common.repository';
import { DetailsService } from './details.service';
import {
    CreateRoomTypeRequestDto,
    UpdateRoomTypeRequestDto,
} from '../models/requests-schemas/create-room-type.request';
import { Locale } from '../models/enums/locale.enum';
import { RoomTypesRepository } from '../repositories/room-types.repository';
import { transformQueryResult } from '../utils/transform-query-result.utils';
import { calculatePaginationData } from '../utils/calculate-pagination-data.utils';

@Injectable()
export class RoomTypesService {
    constructor(
        private readonly detailsRepository: DetailsRepository,
        private readonly commonRepository: CommonRepository,
        private readonly detailsService: DetailsService,
        private readonly roomTypesRepository: RoomTypesRepository,
    ) {}

    public async getAllRoomTypes(name: string, page: number, limit: number, locale: Locale) {
        const { skip, take } = calculatePaginationData(page, limit);
        const [roomTypes, count] = await this.detailsRepository.getAll(
            locale,
            skip,
            take,
            this.detailsService.getNameFilter(locale, name),
            'roomType',
            {},
        );
        return {
            roomTypes: transformQueryResult(
                {
                    renamedFields: {
                        [locale]: 'name',
                    },
                    objectParsingSequence: [],
                },
                roomTypes,
            ),
            count,
        };
    }

    public async getRoomTypeWithSectionsAndChars(id: string, locale: Locale) {
        const roomType = await this.roomTypesRepository.getRoomTypeById(id, locale);
        return transformQueryResult(
            {
                renamedFields: {
                    [locale]: 'name',
                    roomTypeNSectionFields: 'sectionsTypes',
                    characteristicNSectionFields: 'characteristics',
                    characteristicNAttributeFields: 'attributes',
                },
                objectParsingSequence: [
                    'sectionsTypes',
                    'sectionType',
                    'characteristics',
                    'characteristic',
                    'attributes',
                    'attribute',
                ],
            },
            roomType,
        );
    }

    public async createRoomType(body: CreateRoomTypeRequestDto) {
        const { sectionIds, ...bodyValues } = body;
        return this.detailsRepository.createOne(
            bodyValues,
            'roomType',
            this.detailsService.obtainParamsForCreationQuery(sectionIds, 'roomTypeNSectionFields', 'sectionTypeId'),
        );
    }

    public async updateRoomType(body: UpdateRoomTypeRequestDto, id: string) {
        const { sectionIds, ...bodyValues } = body;
        const result = await this.commonRepository.createTransactionWithCallback(async prisma => {
            if (!!sectionIds?.length) {
                await this.detailsRepository.deleteMany(
                    this.detailsService.obtainParamsForDeleteRelations(
                        prisma,
                        'roomTypeNSectionFields',
                        'roomTypeId',
                        id,
                    ),
                );
            }
            return await this.detailsRepository.updateOne(
                this.detailsService.obtainParamsForUpdate({
                    body: bodyValues,
                    id,
                    tableName: 'roomType',
                    prisma,
                    idsForRelation: sectionIds,
                    relationField: 'roomTypeNSectionFields',
                    fieldWithinRelation: 'sectionType',
                }),
            );
        });

        return result;
    }
}
