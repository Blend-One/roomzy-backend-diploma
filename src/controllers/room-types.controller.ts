import { Controller, Get, Query, Req, Param, UseGuards, Body, Post, Patch, Delete } from '@nestjs/common';
import { AuthCheckerGuard } from 'guards/auth-checker.guard';
import { getStatusCheckerGuard } from 'guards/user-status-checker.guard';
import { Role } from 'models/enums/role.enum';
import { UserStatus } from 'models/enums/user-status.enum';
import { Locale } from 'models/enums/locale.enum';
import { getLanguageHeader } from 'utils/request.utils';
import { FALLBACK_LANGUAGE } from 'constants/dict.constants';
import { ZodValidationPipe } from 'pipes/zod-validation.pipe';
import { SectionTypesService } from 'services/section-types.service';
import { ROOM_TYPES_ROUTES } from 'routes/room-types.routes';
import {
    CreateRoomTypeRequestDto,
    CreateRoomTypeSchema,
    UpdateRoomTypeRequestDto,
    UpdateRoomTypeSchema,
} from '../models/requests-schemas/create-room-type.request';

@Controller({ path: ROOM_TYPES_ROUTES.DEFAULT })
export class RoomTypesController {
    constructor(private readonly sectionTypeService: SectionTypesService) {}

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER, Role.USER], UserStatus.ACTIVE))
    @Get(ROOM_TYPES_ROUTES.GET_SECTIONS_AND_CHARS_BY_ROOM_TYPE)
    public async getRoomTypeWithSections(@Req() request: Request) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        // return this.sectionTypeService.getAllSectionTypes();
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER, Role.USER], UserStatus.ACTIVE))
    @Get(ROOM_TYPES_ROUTES.GET_DEFAULT_CHARACTERISTICS_BY_ROOM_TYPE)
    public async getDefaultCharacteristicsByRoomType(@Req() request: Request) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        // return this.sectionTypeService.getAllSectionTypes();
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Post(ROOM_TYPES_ROUTES.CREATE_ROOM_TYPE)
    public async createRoomType(@Body(new ZodValidationPipe(CreateRoomTypeSchema)) body: CreateRoomTypeRequestDto) {
        return this.sectionTypeService.createSectionType(body);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Patch(ROOM_TYPES_ROUTES.UPDATE_ROOM_TYPE)
    public async updateRoomType(
        @Param('id') attributeId: string,
        @Body(new ZodValidationPipe(UpdateRoomTypeSchema)) body: UpdateRoomTypeRequestDto,
    ) {
        return this.sectionTypeService.updateSectionType(body, attributeId);
    }
}
