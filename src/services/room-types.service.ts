import { Injectable } from '@nestjs/common';
import { DetailsRepository } from 'repositories/details.repository';
import { CommonRepository } from 'repositories/common.repository';
import { DetailsService } from './details.service';
import {
    CreateRoomTypeRequestDto,
    UpdateRoomTypeRequestDto,
} from '../models/requests-schemas/create-room-type.request';

@Injectable()
export class RoomTypesService {
    constructor(
        private readonly detailsRepository: DetailsRepository,
        private readonly commonRepository: CommonRepository,
        private readonly detailsService: DetailsService,
    ) {}

    // public async getRoomTypeWithSectionsAndChars() {
    //     return this.detailsRepository.getAll();
    // }

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
