import { Controller, Get, UseGuards } from '@nestjs/common';
import { IMAGE_ROUTES } from '../routes/image.routes';
import { AuthCheckerGuard } from '../guards/auth-checker.guard';

@Controller(IMAGE_ROUTES.DEFAULT)
export class ImageController {
    @Get(IMAGE_ROUTES.GET_ROOM_IMAGE)
    public async getRoomImage() {}

    @UseGuards(AuthCheckerGuard)
    @Get(IMAGE_ROUTES.GET_CONTROVERSIAL_ISSUE_IMAGE)
    public async getControversialIssueImage() {}
}
