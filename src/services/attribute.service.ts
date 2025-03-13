import { Injectable } from '@nestjs/common';
import { Locale } from '../models/enums/locale.enum';
import { DetailsRepository } from '../repositories/details.repository';
import { calculatePaginationData } from '../utils/calculate-pagination-data.utils';
import { DetailsRequestSchemaDto, UpdateDetailsRequestSchemaDto } from '../models/requests-schemas/details.request';

@Injectable()
export class AttributeService {
    constructor(private readonly detailsRepository: DetailsRepository) {}

    public async getAllAttributes(name: string, page: number, limit: number, locale: Locale) {
        const { skip, take } = calculatePaginationData(page, limit);
        return this.detailsRepository.getAll(
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
    }

    public async createAttribute(body: DetailsRequestSchemaDto) {
        return this.detailsRepository.createOne(body, 'attribute', {});
    }

    public async getAttribute(locale: Locale, id: string) {
        return this.detailsRepository.getOne(locale, id, {}, 'attribute');
    }

    public async updateAttribute(body: UpdateDetailsRequestSchemaDto, id: string) {
        return this.detailsRepository.updateOne({ body, id, tableName: 'attribute', updatedRelations: {} });
    }

    public async deleteAttribute(id: string) {
        return this.detailsRepository.deleteOne(id, 'attribute');
    }
}
