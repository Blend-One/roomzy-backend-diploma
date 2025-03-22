import { Injectable } from '@nestjs/common';
import { Locale } from '../models/enums/locale.enum';
import { DetailsRepository } from '../repositories/details.repository';
import { calculatePaginationData } from '../utils/calculate-pagination-data.utils';
import { DetailsRequestSchemaDto, UpdateDetailsRequestSchemaDto } from '../models/requests-schemas/details.request';
import { transformQueryResult } from '../utils/transform-query-result.utils';

@Injectable()
export class AttributeService {
    constructor(private readonly detailsRepository: DetailsRepository) {}

    public async getAllAttributes(name: string, page: number, limit: number, locale: Locale) {
        const { skip, take } = calculatePaginationData(page, limit);
        const [attributes, count] = await this.detailsRepository.getAll(
            locale,
            skip,
            take,
            {
                [locale]: {
                    contains: name,
                },
            },
            'attribute',
            {},
        );

        return {
            attributes: transformQueryResult(
                {
                    renamedFields: {
                        [locale]: 'name',
                    },
                    objectParsingSequence: [],
                },
                attributes,
            ),
            count,
        };
    }

    public async createAttribute(body: DetailsRequestSchemaDto) {
        return this.detailsRepository.createOne(body, 'attribute', {});
    }

    public async getAttribute(locale: Locale, id: string) {
        const attribute = await this.detailsRepository.getOne(locale, id, {}, 'attribute');
        return transformQueryResult(
            {
                renamedFields: {
                    [locale]: 'name',
                },
                objectParsingSequence: [],
            },
            attribute,
        );
    }

    public async updateAttribute(body: UpdateDetailsRequestSchemaDto, id: string) {
        return this.detailsRepository.updateOne({ body, id, tableName: 'attribute', updatedRelations: {} });
    }

    public async deleteAttribute(id: string) {
        return this.detailsRepository.deleteOne(id, 'attribute');
    }
}
