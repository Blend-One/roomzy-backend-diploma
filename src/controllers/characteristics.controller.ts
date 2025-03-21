import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthCheckerGuard } from 'guards/auth-checker.guard';
import { getStatusCheckerGuard } from 'guards/user-status-checker.guard';
import { Role } from 'models/enums/role.enum';
import { UserStatus } from 'models/enums/user-status.enum';
import { Locale } from 'models/enums/locale.enum';
import { getLanguageHeader } from 'utils/request.utils';
import { FALLBACK_LANGUAGE } from 'constants/dict.constants';
import { CHARACTERISTICS_ROUTES } from 'routes/characteristics.routes';
import { ZodValidationPipe } from 'pipes/zod-validation.pipe';
import {
    CreateCharacteristicRequestDto,
    CreateCharacteristicSchema,
    UpdateCharacteristicRequestDto,
    UpdateCharacteristicSchema,
} from 'models/requests-schemas/create-characteristic.request';
import { CharacteristicsService } from 'services/characteristics.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';
import { PaginationQueryParamsDocs } from '../decorators/pagination-query-params-docs.decorators';

@ApiBearerAuth()
@ApiTags(API_TAGS.CHARACTERISTICS)
@UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
@Controller({ path: CHARACTERISTICS_ROUTES.DEFAULT })
export class CharacteristicsController {
    constructor(private readonly characteristicService: CharacteristicsService) {}

    @ApiOperation({ summary: 'Get characteristics' })
    @Get(CHARACTERISTICS_ROUTES.GET_ALL_CHARACTERISTICS)
    @PaginationQueryParamsDocs()
    @ApiQuery({ name: 'name', required: false, description: 'Name of characteristic' })
    public async getAllAttributes(
        @Req() request: Request,
        @Query('name') name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.characteristicService.getAllCharacteristics(name, page, limit, locale);
    }

    @ApiOperation({ summary: 'Create characteristic' })
    @Post(CHARACTERISTICS_ROUTES.CREATE_CHARACTERISTIC)
    public async createAttribute(
        @Body(new ZodValidationPipe(CreateCharacteristicSchema)) body: CreateCharacteristicRequestDto,
    ) {
        return this.characteristicService.createCharacteristic(body);
    }

    @ApiOperation({
        summary:
            'Delete characteristic, if characteristic is deleted, relations with attributes will be deleted as well',
    })
    @Delete(CHARACTERISTICS_ROUTES.DELETE_CHARACTERISTIC)
    public async deleteAttributeById(@Param('id') characteristicId: string) {
        return this.characteristicService.deleteCharacteristic(characteristicId);
    }

    @ApiOperation({
        summary: 'Get single characteristic. Attributes are included',
    })
    @Get(CHARACTERISTICS_ROUTES.GET_CHARACTERISTIC)
    public async getAttributeById(@Req() request: Request, @Param('id') attributeId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.characteristicService.getCharacteristic(locale, attributeId);
    }

    @ApiOperation({
        summary: 'Get default characteristics by roomTypeId (Seems like it is excessive a bit, will be deleted)',
    })
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER, Role.USER], UserStatus.ACTIVE))
    @Get(CHARACTERISTICS_ROUTES.GET_DEFAULT_CHARACTERISTICS_BY_ROOM_TYPE)
    public async getDefaultCharacteristicsByRoomType(@Req() request: Request, @Param('roomTypeId') roomTypeId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.characteristicService.getDefaultCharacteristicsByRoomTypeId(roomTypeId, locale);
    }

    @ApiOperation({
        summary: 'Update characteristic',
    })
    @Patch(CHARACTERISTICS_ROUTES.UPDATE_CHARACTERISTIC)
    public async updateAttribute(
        @Param('id') attributeId: string,
        @Body(new ZodValidationPipe(UpdateCharacteristicSchema)) body: UpdateCharacteristicRequestDto,
    ) {
        return this.characteristicService.updateCharacteristic(body, attributeId);
    }
}
