import { Injectable } from '@nestjs/common';
import { DictRepository } from '../repositories/dict.repository';
import { Locale } from 'models/enums/locale.enum';
import { transformQueryResult } from 'utils/transform-query-result.utils';

@Injectable()
export class DictService {
    constructor(private readonly dictRepository: DictRepository) {}

    public async getCites(locale: Locale) {
        const cities = await this.dictRepository.getDictData('city', locale);
        return transformQueryResult(
            {
                renamedFields: { [locale]: 'name' },
                objectParsingSequence: [],
            },
            cities,
        );
    }

    public async getDistricts(locale: Locale, cityId: string) {
        const cities = await this.dictRepository.getDictData('district', locale, { cityId });
        return transformQueryResult(
            {
                renamedFields: { [locale]: 'name' },
                objectParsingSequence: [],
            },
            cities,
        );
    }
}
