import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { IMAGE_ROUTES } from 'routes/image.routes';
import { AuthCheckerGuard } from 'guards/auth-checker.guard';
import { S3Service } from 'services/s3.service';
import { S3Bucket } from 'models/enums/s3-bucket.enum';
import { Response } from 'express';
import { setCacheControlHeader } from '../utils/response.utils';
import { CACHE_IMAGE_CONTROL, CACHE_IMAGE_CONTROL_PRIVATE } from '../constants/response.constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';

@ApiTags(API_TAGS.IMAGES)
@Controller(IMAGE_ROUTES.DEFAULT)
export class ImageController {
    constructor(private s3Service: S3Service) {}

    @ApiOperation({ summary: 'Get image by id' })
    @Get(IMAGE_ROUTES.GET_ROOM_IMAGE)
    public async getRoomImage(@Param('imageId') imageId: string, @Res() response: Response) {
        const file = await this.s3Service.getFile(S3Bucket.PHOTOS, imageId);
        response.setHeader('Content-Type', file.ContentType);
        setCacheControlHeader(response, CACHE_IMAGE_CONTROL);
        (file.Body as { pipe: (response: Response) => void }).pipe(response);
    }

    @ApiOperation({ summary: 'Get image from controversial issues bucket by id (authorization is required)' })
    @UseGuards(AuthCheckerGuard)
    @Get(IMAGE_ROUTES.GET_CONTROVERSIAL_ISSUE_IMAGE)
    public async getControversialIssueImage(@Param('imageId') imageId: string, @Res() response: Response) {
        const file = await this.s3Service.getFile(S3Bucket.CONFLICTS, imageId);
        response.setHeader('Content-Type', file.ContentType);
        setCacheControlHeader(response, CACHE_IMAGE_CONTROL_PRIVATE);
        (file.Body as { pipe: (response: Response) => void }).pipe(response);
    }
}
