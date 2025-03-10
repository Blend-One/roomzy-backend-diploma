import { Controller, Get, Query, Req, Param, UseGuards, Body, Post, Patch } from '@nestjs/common';
import { DETAIL_ROUTES } from 'routes/detail.routes';
import { AuthCheckerGuard } from '../guards/auth-checker.guard';
import { getStatusCheckerGuard } from '../guards/user-status-checker.guard';
import { Role } from '../models/enums/role.enum';
import { UserStatus } from '../models/enums/user-status.enum';
import { Locale } from '../models/enums/locale.enum';
import { getLanguageHeader } from '../utils/request.utils';
import { FALLBACK_LANGUAGE } from '../constants/dict.constants';
import { ATTRIBUTE_ROUTES } from '../routes/attributes.routes';
import { AttributeService } from '../services/attribute.service';

@Controller({ path: ATTRIBUTE_ROUTES.DEFAULT })
export class AttributesController {
    constructor(private readonly attributesService: AttributeService) {}

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(DETAIL_ROUTES.GET_ALL_ATTRIBUTES)
    public async getAllAttributes(
        @Req() request: Request,
        @Query('name') name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.attributesService.getAllAttributes(name, page, limit, locale);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Post(DETAIL_ROUTES.CREATE_ATTRIBUTE)
    public async createAttribute(@Req() request: Request, @Body() body: any) {
        return this.attributesService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(DETAIL_ROUTES.GET_ATTRIBUTE)
    public async getAttributeById(@Req() request: Request, @Param('id') attributeId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.attributesService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Patch(DETAIL_ROUTES.UPDATE_ATTRIBUTE)
    public async updateAttribute(@Req() request: Request, @Param('id') attributeId: string, @Body() body: any) {
        return this.attributesService;
    }
}
