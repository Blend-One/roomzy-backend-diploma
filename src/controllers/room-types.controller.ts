import { Controller, Get, Query, Req, Param, UseGuards, Body, Post, Patch, Delete } from '@nestjs/common';
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';

@ApiBearerAuth()
@ApiTags(API_TAGS.ROOM_TYPES)
@Controller({ path: ROOM_TYPES_ROUTES.DEFAULT })
export class RoomTypesController {
    constructor(private readonly roomTypesService: RoomTypesService) {}

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER, Role.USER], UserStatus.ACTIVE))
    @Get(ROOM_TYPES_ROUTES.GET_SECTIONS_AND_CHARS_BY_ROOM_TYPE)
    public async getRoomTypeWithSections(@Req() request: Request, @Param('roomTypeId') roomTypeId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.roomTypesService.getRoomTypeWithSectionsAndChars(roomTypeId, locale);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Post(ROOM_TYPES_ROUTES.CREATE_ROOM_TYPE)
    public async createRoomType(@Body(new ZodValidationPipe(CreateRoomTypeSchema)) body: CreateRoomTypeRequestDto) {
        return this.roomTypesService.createRoomType(body);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Patch(ROOM_TYPES_ROUTES.UPDATE_ROOM_TYPE)
    public async updateRoomType(
        @Param('id') roomTypeId: string,
        @Body(new ZodValidationPipe(UpdateRoomTypeSchema)) body: UpdateRoomTypeRequestDto,
    ) {
        return this.roomTypesService.updateRoomType(body, roomTypeId);
    }
}
