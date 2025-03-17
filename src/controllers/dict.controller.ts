import { Controller, Get, Param, Req } from '@nestjs/common';
import { DICT_ROUTES } from '../routes/dict.routes';
import { getLanguageHeader } from '../utils/request.utils';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';
import { FALLBACK_LANGUAGE } from '../constants/dict.constants';
import { DictService } from '../services/dict.service';
import { Locale } from '../models/enums/locale.enum';

@ApiTags(API_TAGS.DICTIONARIES)
@Controller({
    path: DICT_ROUTES.DEFAULT,
})
export class DictController {
    constructor(private dictService: DictService) {}

    @ApiOperation({ summary: 'Get cities' })
    @Get(DICT_ROUTES.GET_CITIES)
    public async getCities(@Req() request: Request) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.dictService.getCites(locale);
    }

    @ApiOperation({ summary: 'Get districts by cityId' })
    @Get(DICT_ROUTES.GET_DISTRICTS)
    public async getDistricts(@Req() request: Request, @Param('cityId') cityId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.dictService.getDistricts(locale, cityId);
    }
}
