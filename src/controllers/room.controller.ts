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
import { ToJsonPipe } from 'pipes/to-json.pipe';
import { FiltersDto } from 'models/dtos/fitlers.dto';
import { getLanguageHeader, getUserHeader } from 'utils/request.utils';
import { Role } from 'models/enums/role.enum';
import { RequestStatusDto } from 'models/dtos/room-request-status.dto';
import { UpdateRoomRequestDto, UpdateRoomSchema } from 'models/requests-schemas/update-ad.request';
import { Locale } from 'models/enums/locale.enum';
import { FALLBACK_LANGUAGE } from 'constants/dict.constants';
import { RoomStatus } from 'models/enums/room-status.enum';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { API_TAGS } from 'constants/api-tags.constants';
import { MULTIPART_CONTENT_TYPE } from '../constants/response.constants';
import { CreateRoomDto } from '../api-bodies/create-room.api-body';
import { RoomDto } from '../api-bodies/room.api-body';
import { RoomResponseDto } from '../api-bodies/room-response.api-body';
import { RoomWithSectionsDto } from '../api-bodies/room-with-sections.api-body';
import { PaginationQueryParamsDocs } from '../decorators/pagination-query-params-docs.decorators';
import { FilterParsePipe } from '../pipes/filter-parse.pipe';
import { FiltersDocsDto } from '../api-bodies/filter.api-body';
import { StatusDto } from '../api-bodies/status.api-body';
import { UpdateRoomDto } from '../api-bodies/update-room.api-body';

@ApiBearerAuth()
@ApiTags(API_TAGS.ROOMS)
@Controller({ path: ROOM_ROUTES.DEFAULT })
export class RoomController {
    constructor(private roomService: RoomService) {}

    @ApiOperation({ summary: 'Create room' })
    @ApiConsumes(MULTIPART_CONTENT_TYPE)
    @ApiBody({ type: CreateRoomDto })
    @ApiCreatedResponse({ type: RoomResponseDto })
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

    @PaginationQueryParamsDocs()
    @ApiOperation({
        description:
            'Required to pass filters in query params (check FiltersDocsDto schema) ' +
            'Maybe in further implementation endpoint will be reworked for POST support due to limits of query params length',
        summary: 'Get rooms',
    })
    @ApiQuery({
        name: 'filters',
        required: false,
        type: FiltersDocsDto,
    })
    @ApiOkResponse({ type: [RoomDto] })
    @Get(ROOM_ROUTES.GET_ADS)
    public async getAds(
        @Req() request: Request,
        @Query(FilterParsePipe) params: FiltersDto,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.roomService.getAds(params, locale, page, limit);
    }

    @ApiOperation({ summary: 'Get personal rooms' })
    @PaginationQueryParamsDocs()
    @ApiQuery({ name: 'status', required: false, description: 'Room status' })
    @ApiOkResponse({ type: [RoomDto] })
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    @Get(ROOM_ROUTES.GET_PERSONAL_ADS)
    public async getPersonalAds(
        @Req() request: Request,
        @Query('status') status: RoomStatus,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        const user = getUserHeader(request);
        return this.roomService.getPersonalAds(status, locale, page, limit, user.id);
    }

    @ApiOperation({
        summary: 'Change status of the room',
        description:
            'Available statuses: OPENED | ARCHIVED. If actual status of room equals to provided status, exception will be thrown',
    })
    @ApiBody({ type: StatusDto })
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    @Patch(ROOM_ROUTES.CHANGE_STATUS_OF_AD)
    public async changeAdStatus(@Param('id') id: string, @Req() request: Request, @Body() body: RequestStatusDto) {
        const user = getUserHeader(request);
        const { status } = body;
        return this.roomService.changeAdStatus(id, status, user.id);
    }

    @ApiOperation({
        summary: 'Change status of the room (for MANAGERS)',
        description:
            'Available statuses: IN_MODERATION | REJECTED | OPENED. If actual status of room equals to provided status, exception will be thrown',
    })
    @ApiBody({ type: StatusDto })
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Patch(ROOM_ROUTES.CHANGE_STATUS_OF_IN_MODERATION_AD)
    public async changeInModerationAdStatus(@Param('id') id: string, @Body() body: RequestStatusDto) {
        const { status } = body;
        return this.roomService.changeInModerationAdStatus(id, status);
    }

    @ApiOperation({
        summary: 'Get rooms in moderation status',
        description:
            'Required to pass filters in query params (check FiltersDocsDto schema) ' +
            'Maybe in further implementation endpoint will be reworked for POST support due to limits of query params length',
    })
    @PaginationQueryParamsDocs()
    @ApiQuery({
        name: 'filters',
        required: false,
        type: FiltersDocsDto,
    })
    @ApiOkResponse({ type: [RoomDto] })
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(ROOM_ROUTES.GET_MODERATION_ADS)
    public async getAdsInModeration(
        @Req() request: Request,
        @Query(FilterParsePipe) filters: FiltersDto,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.roomService.getAdsForModeration(filters, locale, page, limit);
    }

    @ApiOperation({ summary: 'Get single room' })
    @ApiOkResponse({ type: RoomWithSectionsDto })
    @Get(ROOM_ROUTES.GET_AD)
    public async getAd(@Param('id') id: string, @Req() request: Request) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        const user = getUserHeader(request);
        return this.roomService.getAd(id, locale, user?.id ?? null, user?.role ?? null);
    }

    @ApiOperation({ summary: 'Update room' })
    @ApiConsumes(MULTIPART_CONTENT_TYPE)
    @ApiBody({ type: UpdateRoomDto })
    @ApiOkResponse({ type: RoomResponseDto })
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
