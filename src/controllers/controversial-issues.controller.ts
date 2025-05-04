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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';
import { MULTIPART_CONTENT_TYPE } from '../constants/response.constants';
import { CreateControversialIssuesDto } from '../api-bodies/create-controversial-issues.api-body';
import {
    ControversialIssuesDto,
    ControversialIssuesForModerationDto,
} from '../api-bodies/controversial-issues-response.api-body';
import { RentStatusDto } from '../api-bodies/status.api-body';

@ApiBearerAuth()
@ApiTags(API_TAGS.CONTROVERSIAL_ISSUES)
@Controller({ path: CONTROVERSIAL_ISSUES_ROUTES.DEFAULT })
export class ControversialIssuesController {
    constructor(private controversialIssuesService: ControversialIssuesService) {}

    @ApiOperation({ summary: 'Create controversial issues' })
    @ApiConsumes(MULTIPART_CONTENT_TYPE)
    @ApiBody({ type: CreateControversialIssuesDto })
    @ApiOkResponse({ type: [ControversialIssuesDto] })
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

    @ApiOperation({ summary: 'Get controversial issues by rentId (for renters)' })
    @ApiOkResponse({ type: [ControversialIssuesDto] })
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    @Get(CONTROVERSIAL_ISSUES_ROUTES.GET_BY_RENT_ID)
    public async getIssuesByRentId(@Req() request: Request, @Param('rentId') rentId: string) {
        const user = getUserHeader(request);
        return this.controversialIssuesService.getControversialIssuesByRentId(user.id, rentId);
    }

    @ApiOperation({ summary: 'Get controversial issues by roomId (for landlords)' })
    @ApiOkResponse({ type: [ControversialIssuesDto] })
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    @Get(CONTROVERSIAL_ISSUES_ROUTES.GET_BY_ROOM_ID)
    public async getIssuesByRoomId(@Req() request: Request, @Param('roomId') roomId: string) {
        const user = getUserHeader(request);
        return this.controversialIssuesService.getControversialIssuesByRoomId(user.id, roomId);
    }

    @ApiOperation({ summary: 'Get controversial issues for moderation (for managers)' })
    @ApiOkResponse({ type: [ControversialIssuesForModerationDto] })
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Get(CONTROVERSIAL_ISSUES_ROUTES.GET_FOR_MODERATION)
    public async getIssuesForModeration(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.controversialIssuesService.getControversialIssuesForModeration(page, limit);
    }

    @ApiOperation({ summary: 'Update status of rent where controversial issues on check' })
    @ApiBody({ type: RentStatusDto })
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
    @Patch(CONTROVERSIAL_ISSUES_ROUTES.CHANGE_STATUS_FOR_MODERATION)
    public async changeStatusForModeration(@Body() body: { status: RentStatus }, @Param('rentId') rentId: string) {
        return this.controversialIssuesService.changeStatusForControversialIssues(rentId, body.status);
    }
}
