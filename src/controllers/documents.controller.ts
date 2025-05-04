import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { DOCUMENTS_ROUTES } from '../routes/documents.routes';
import DocumentsService from '../services/documents.service';
import { AuthCheckerGuard } from '../guards/auth-checker.guard';
import { getStatusCheckerGuard } from '../guards/user-status-checker.guard';
import { Role } from '../models/enums/role.enum';
import { UserStatus } from '../models/enums/user-status.enum';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { DocumentSignRequest, DocumentSignRequestDto } from '../models/requests-schemas/document.request';
import { getUserHeader } from '../utils/request.utils';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';
import { VerifyDocumentDto } from '../api-bodies/verify-document.api-body';
import { StatusOkDto } from '../api-bodies/status-ok.api-body';
import { DocumentDto } from '../api-bodies/document.api-body';

@ApiBearerAuth()
@ApiTags(API_TAGS.DOCUMENTS)
@Controller({
    path: DOCUMENTS_ROUTES.DEFAULT,
})
export default class DocumentsController {
    constructor(private documentsService: DocumentsService) {}

    @ApiOperation({
        summary: 'Sign and verify the document based on provided cms',
    })
    @ApiBody({ type: VerifyDocumentDto })
    @ApiOkResponse({ type: StatusOkDto })
    @Post(DOCUMENTS_ROUTES.SIGN)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async signDocument(
        @Body(new ZodValidationPipe(DocumentSignRequest)) body: DocumentSignRequestDto,
        @Param('id') documentId: string,
        @Req() req: Request,
    ) {
        const user = getUserHeader(req);
        return this.documentsService.signDocument(documentId, user.id, body);
    }

    @ApiOperation({
        summary: 'Get document as PDF',
    })
    @Get(DOCUMENTS_ROUTES.GET_AS_FILE)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async getAsPDF(@Param('id') documentId: string, @Req() req: Request, @Res() res: Response) {
        const user = getUserHeader(req);
        return this.documentsService.getPDFDocument(documentId, user.id, res);
    }

    @ApiOperation({
        summary: 'Get document as JSON representation',
    })
    @ApiOkResponse({ type: DocumentDto })
    @Get(DOCUMENTS_ROUTES.GET)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async getDocument(@Req() req: Request, @Param('rentId') rentId: string) {
        const user = getUserHeader(req);
        return this.documentsService.getDocument(rentId, user.id);
    }
}
