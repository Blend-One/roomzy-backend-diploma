import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CONTROVERSIAL_ISSUES_ROUTES } from '../routes/controversial-issues.routes';
import { AuthCheckerGuard } from '../guards/auth-checker.guard';
import { getStatusCheckerGuard } from '../guards/user-status-checker.guard';
import { Role } from '../models/enums/role.enum';
import { UserStatus } from '../models/enums/user-status.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILE_PROPERTY_NAME } from '../constants/file.constants';
import { getUserHeader } from '../utils/request.utils';
import { filterFiles } from '../utils/file-filter.utils';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
    ControversialIssueDto,
    ControversialIssueSchema,
} from '../models/requests-schemas/controversial-issues.request';
import { ControversialIssuesService } from '../services/controversial-issues.service';
import { RentStatus } from '../models/enums/rent-status.enum';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';

@ApiTags(API_TAGS.CONTROVERSIAL_ISSUES)
@Controller({ path: CONTROVERSIAL_ISSUES_ROUTES.DEFAULT })
export class ControversialIssuesController {
    constructor(private controversialIssuesService: ControversialIssuesService) {}

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    @UseInterceptors(FilesInterceptor(FILE_PROPERTY_NAME))
    @Post(CONTROVERSIAL_ISSUES_ROUTES.CREATE)
    public async createControversialIssue(
        @Body(new ZodValidationPipe(ControversialIssueSchema)) body: ControversialIssueDto,
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Req() request: Request,
        @Param('rentId') rentId: string,
    ) {
        filterFiles(images);
        const user = getUserHeader(request);
        return this.controversialIssuesService.createControversialIssues(body.descriptions, images, user.id, rentId);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    @Get(CONTROVERSIAL_ISSUES_ROUTES.GET_BY_RENT_ID)
    public async getIssuesByRentId(@Req() request: Request, @Param('rentId') rentId: string) {
        const user = getUserHeader(request);
        return this.controversialIssuesService.getControversialIssuesByRentId(user.id, rentId);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    @Get(CONTROVERSIAL_ISSUES_ROUTES.GET_BY_ROOM_ID)
    public async getIssuesByRoomId(@Req() request: Request, @Param('roomId') roomId: string) {
        const user = getUserHeader(request);
        return this.controversialIssuesService.getControversialIssuesByRoomId(user.id, roomId);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(CONTROVERSIAL_ISSUES_ROUTES.GET_FOR_MODERATION)
    public async getIssuesForModeration(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.controversialIssuesService.getControversialIssuesForModeration(page, limit);
    }

    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Patch(CONTROVERSIAL_ISSUES_ROUTES.CHANGE_STATUS_FOR_MODERATION)
    public async changeStatusForModeration(@Body() body: { status: RentStatus }, @Param('rentId') rentId: string) {
        return this.controversialIssuesService.changeStatusForControversialIssues(rentId, body.status);
    }
}
