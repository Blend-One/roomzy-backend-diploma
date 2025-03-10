import { Controller, Get, Query, Req, Param, UseGuards, Body, Post, Patch } from '@nestjs/common';
import { DETAIL_ROUTES } from 'routes/detail.routes';
import { AuthCheckerGuard } from '../guards/auth-checker.guard';
import { getStatusCheckerGuard } from '../guards/user-status-checker.guard';
import { Role } from '../models/enums/role.enum';
import { UserStatus } from '../models/enums/user-status.enum';
import { Locale } from '../models/enums/locale.enum';
import { getLanguageHeader } from '../utils/request.utils';
import { FALLBACK_LANGUAGE } from '../constants/dict.constants';
import { DetailsService } from '../services/details.service';

@Controller({ path: DETAIL_ROUTES.DEFAULT })
export class DetailsController {
    constructor(private readonly detailsService: DetailsService) {}

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(DETAIL_ROUTES.GET_ALL_ATTRIBUTES)
    public async getAllAttributes(
        @Req() request: Request,
        @Query('name') name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.detailsService.getAllAttributes(name, page, limit, locale);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(DETAIL_ROUTES.GET_ALL_CHARACTERISTICS)
    public async getAllCharacteristics(
        @Req() request: Request,
        @Query('name') name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.detailsService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(DETAIL_ROUTES.GET_ALL_ROOM_TYPES)
    public async getAllRoomTypes(
        @Req() request: Request,
        @Query('name') name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.detailsService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(DETAIL_ROUTES.GET_ALL_SECTION_TYPES)
    public async getAllSectionTypes(
        @Req() request: Request,
        @Query('name') name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.detailsService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER, Role.USER], UserStatus.ACTIVE))
    @Get(DETAIL_ROUTES.GET_SECTIONS_AND_CHARS_BY_ROOM_TYPE)
    public async getCharacteristicsByRoomTypeId(@Req() request: Request, @Param('roomTypeId') roomTypeId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.detailsService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER, Role.USER], UserStatus.ACTIVE))
    @Get(DETAIL_ROUTES.GET_DEFAULT_CHARACTERISTICS_BY_ROOM_TYPE)
    public async getDefaultCharacteristicsByRoomTypeId(
        @Req() request: Request,
        @Param('roomTypeId') roomTypeId: string,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.detailsService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Post(DETAIL_ROUTES.CREATE_ATTRIBUTE)
    public async createAttribute(@Req() request: Request, @Body() body: any) {
        return this.detailsService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(DETAIL_ROUTES.GET_ATTRIBUTE)
    public async getAttributeById(@Req() request: Request, @Param('id') attributeId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.detailsService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Patch(DETAIL_ROUTES.UPDATE_ATTRIBUTE)
    public async updateAttribute(@Req() request: Request, @Param('id') attributeId: string, @Body() body: any) {
        return this.detailsService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Post(DETAIL_ROUTES.CREATE_CHARACTERISTIC)
    public async createCharacteristic(@Req() request: Request, @Body() body: any) {
        return this.detailsService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(DETAIL_ROUTES.GET_CHARACTERISTIC)
    public async getCharacteristicId(@Req() request: Request, @Param('id') characteristicId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.detailsService;
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Patch(DETAIL_ROUTES.UPDATE_CHARACTERISTIC)
    public async updateCharacteristic(
        @Req() request: Request,
        @Param('id') characteristicId: string,
        @Body() body: any,
    ) {
        return this.detailsService;
    }
}
