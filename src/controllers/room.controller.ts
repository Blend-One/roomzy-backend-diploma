import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes,
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

@Controller({ path: ROOM_ROUTES.DEFAULT })
export class RoomController {
    constructor(private roomService: RoomService) {}

    @UsePipes(new ZodValidationPipe(CreateRoomSchema))
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard(UserStatus.ACTIVE))
    @UseInterceptors(FilesInterceptor(FILE_PROPERTY_NAME))
    @Post(ROOM_ROUTES.CREATE_AD)
    public async createAd(
        @Req() request: Request,
        @Body() body: CreateRoomRequestDto,
        @UploadedFiles()
        images: Array<Express.Multer.File>,
    ) {
        filterFiles(images);
        return this.roomService.createAd(body);
    }

    @Get(ROOM_ROUTES.GET_ADS)
    public async getAds() {
        return this.roomService.getAds();
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard(UserStatus.ACTIVE))
    @Patch(ROOM_ROUTES.CHANGE_STATUS_OF_AD)
    public async changeAdStatus(@Req() request: Request) {
        return this.roomService.changeAdStatus();
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard(UserStatus.ACTIVE))
    @Get(ROOM_ROUTES.GET_MODERATION_ADS)
    public async getAdsInModeration(@Req() request: Request) {
        return this.roomService.getAdsForModeration();
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard(UserStatus.ACTIVE))
    @Patch(ROOM_ROUTES.UPDATE_AD)
    public async updateAd(@Req() request: Request) {
        return this.roomService.updateAd();
    }
}
