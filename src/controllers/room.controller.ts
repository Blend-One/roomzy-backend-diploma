import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    Param,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ROOM_ROUTES } from 'routes/room.routes';
import { AuthCheckerGuard } from 'guards/auth-checker.guard';
import { ZodValidationPipe } from 'pipes/zod-validation.pipe';
import { CreateRoomRequestDto, CreateRoomSchema } from 'models/requests-schemas/create-ad.request';
import { RoomService } from 'services/room.service';
import { getStatusCheckerGuard } from 'guards/user-status-checker.guard';
import { UserStatus } from 'models/enums/user-status.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILE_PROPERTY_NAME } from 'constants/file.constants';
import { filterFiles } from 'utils/file-filter.utils';
import { ToJsonPipe } from '../pipes/to-json.pipe';
import { PaginatedFilters } from '../models/dtos/fitlers.dto';
import { getLanguageHeader, getUserHeader } from '../utils/request.utils';
import { Role } from '../models/enums/role.enum';
import { RequestStatusDto } from '../models/dtos/room-request-status.dto';
import { UpdateRoomRequestDto, UpdateRoomSchema } from '../models/requests-schemas/update-ad.request';
import { Locale } from '../models/enums/locale.enum';
import { FALLBACK_LANGUAGE } from '../constants/dict.constants';

@Controller({ path: ROOM_ROUTES.DEFAULT })
export class RoomController {
    constructor(private roomService: RoomService) {}

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    @UseInterceptors(FilesInterceptor(FILE_PROPERTY_NAME))
    @Post(ROOM_ROUTES.CREATE_AD)
    public async createAd(
        @Body(new ZodValidationPipe(CreateRoomSchema)) body: CreateRoomRequestDto,
        @UploadedFiles()
        images: Array<Express.Multer.File>,
        @Req() request: Request,
    ) {
        filterFiles(images);
        return this.roomService.createAd(body as Required<CreateRoomRequestDto>, images, request);
    }

    @Get(ROOM_ROUTES.GET_ADS)
    public async getAds(@Req() request: Request, @Query('filters', ToJsonPipe) filters: PaginatedFilters) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.roomService.getAds(filters, locale);
    }

    @Get(ROOM_ROUTES.GET_AD)
    public async getAd(@Param('id') id: string, @Req() request: Request) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.roomService.getAd(id, locale);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    @Patch(ROOM_ROUTES.CHANGE_STATUS_OF_AD)
    public async changeAdStatus(@Param('id') id: string, @Req() request: Request, @Body() body: RequestStatusDto) {
        const user = getUserHeader(request);
        const { status } = body;
        return this.roomService.changeAdStatus(id, status, user.id);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Patch(ROOM_ROUTES.CHANGE_STATUS_OF_IN_MODERATION_AD)
    public async changeInModerationAdStatus(@Param('id') id: string, @Body() body: RequestStatusDto) {
        const { status } = body;
        return this.roomService.changeInModerationAdStatus(id, status);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(ROOM_ROUTES.GET_MODERATION_ADS)
    public async getAdsInModeration(@Req() request: Request, @Query('filters', ToJsonPipe) filters: PaginatedFilters) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.roomService.getAdsForModeration(filters, locale);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER, Role.MANAGER], UserStatus.ACTIVE))
    @UseInterceptors(FilesInterceptor(FILE_PROPERTY_NAME))
    @Patch(ROOM_ROUTES.UPDATE_AD)
    public async updateAd(
        @Body(new ZodValidationPipe(UpdateRoomSchema)) body: UpdateRoomRequestDto,
        @UploadedFiles()
        images: Array<Express.Multer.File>,
        @Req() request: Request,
        @Param('id') roomId: string,
    ) {
        filterFiles(images, false);
        return this.roomService.updateAd(body, images, request, roomId);
    }
}
