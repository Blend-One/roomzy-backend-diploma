import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { DICT_ROUTES } from '../routes/dict.routes';
import { getLanguageHeader } from '../utils/request.utils';
import { DictRepository } from '../repositories/dict.repository';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';
import { FALLBACK_LANGUAGE } from '../constants/dict.constants';

@ApiTags(API_TAGS.DICTIONARIES)
@Controller({
    path: DICT_ROUTES.DEFAULT,
})
export class DictController {
    constructor(private dictRepository: DictRepository) {}

    @Get(DICT_ROUTES.GET_CITIES)
    public async getCities(@Req() request: Request) {
        const locale = getLanguageHeader(request) || FALLBACK_LANGUAGE;
        return this.dictRepository.getDictData('city', locale);
    }

    @Get(DICT_ROUTES.GET_DISTRICTS)
    public async getDistricts(@Req() request: Request, @Param('cityId') cityId: string) {
        const locale = getLanguageHeader(request) || FALLBACK_LANGUAGE;
        return this.dictRepository.getDictData('district', locale, { cityId });
    }
}
