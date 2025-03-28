import { Controller, Get, Query, Req, Param, UseGuards, Body, Post, Patch, Delete, Res } from '@nestjs/common';
import { AuthCheckerGuard } from 'guards/auth-checker.guard';
import { getStatusCheckerGuard } from 'guards/user-status-checker.guard';
import { Role } from 'models/enums/role.enum';
import { UserStatus } from 'models/enums/user-status.enum';
import { Locale } from 'models/enums/locale.enum';
import { getLanguageHeader } from 'utils/request.utils';
import { FALLBACK_LANGUAGE } from 'constants/dict.constants';
import { ZodValidationPipe } from 'pipes/zod-validation.pipe';
import { ROOM_TYPES_ROUTES } from 'routes/room-types.routes';
import {
    CreateRoomTypeRequestDto,
    CreateRoomTypeSchema,
    UpdateRoomTypeRequestDto,
    UpdateRoomTypeSchema,
} from '../models/requests-schemas/create-room-type.request';
import { RoomTypesService } from '../services/room-types.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';
import { setXTotalCountHeader } from '../utils/response.utils';
import { Response } from 'express';
import { PaginationQueryParamsDocs } from '../decorators/pagination-query-params-docs.decorators';
import { DetailsResponseDto } from '../api-bodies/create-details.api-body';
import {
    CreateRoomTypeDetailsDto,
    PatchRoomTypeDetailsDto,
    RoomTypeWithSectionTypesDto,
} from '../api-bodies/create-room-type-detail.api-body';

@ApiBearerAuth()
@ApiTags(API_TAGS.ROOM_TYPES)
@Controller({ path: ROOM_TYPES_ROUTES.DEFAULT })
export class RoomTypesController {
    constructor(private readonly roomTypesService: RoomTypesService) {}

    @ApiOperation({
        summary: 'Get types of room. Section types are included',
    })
    @PaginationQueryParamsDocs()
    @ApiQuery({ name: 'name', required: false, description: "Name of room's type" })
    @ApiOkResponse({ type: [RoomTypeWithSectionTypesDto] })
    @Get(ROOM_TYPES_ROUTES.GET_ROOM_TYPES)
    public async getRoomTypes(
        @Req() request: Request,
        @Res() response: Response,
        @Query('name') name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        const { roomTypes, count } = await this.roomTypesService.getAllRoomTypes(name, page, limit, locale);
        setXTotalCountHeader(response, count);
        response.json(roomTypes);
    }

    @ApiOperation({
        summary: 'Get room type. Sections and its characteristics with attributes are included.',
        description:
            'Required to use this endpoint for getting necessary attributes depending on the specific room type',
    })
    @Get(ROOM_TYPES_ROUTES.GET_SECTIONS_AND_CHARS_BY_ROOM_TYPE)
    public async getRoomTypeWithSections(@Req() request: Request, @Param('roomTypeId') roomTypeId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.roomTypesService.getRoomTypeWithSectionsAndChars(roomTypeId, locale);
    }

    @ApiOperation({
        summary: 'Create room type. Section types should be provided in order',
    })
    @ApiBody({ type: CreateRoomTypeDetailsDto })
    @ApiCreatedResponse({ type: DetailsResponseDto })
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Post(ROOM_TYPES_ROUTES.CREATE_ROOM_TYPE)
    public async createRoomType(@Body(new ZodValidationPipe(CreateRoomTypeSchema)) body: CreateRoomTypeRequestDto) {
        return this.roomTypesService.createRoomType(body);
    }

    @ApiOperation({
        summary: 'Delete room type. Relations with section types will be deleted',
    })
    @ApiOkResponse({ type: DetailsResponseDto })
    @Delete(ROOM_TYPES_ROUTES.DELETE_ROOM_TYPE)
    public async deleteRoomTypeById(@Param('id') roomTypeId: string) {
        return this.roomTypesService.deleteRoomType(roomTypeId);
    }

    @ApiOperation({
        summary: 'Update room type',
    })
    @ApiOkResponse({ type: DetailsResponseDto })
    @ApiBody({ type: PatchRoomTypeDetailsDto })
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Patch(ROOM_TYPES_ROUTES.UPDATE_ROOM_TYPE)
    public async updateRoomType(
        @Param('id') roomTypeId: string,
        @Body(new ZodValidationPipe(UpdateRoomTypeSchema)) body: UpdateRoomTypeRequestDto,
    ) {
        return this.roomTypesService.updateRoomType(body, roomTypeId);
    }
}
