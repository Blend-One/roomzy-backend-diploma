import { Controller, Get, Query, Req, Param, UseGuards, Body, Post, Patch, Delete } from '@nestjs/common';
import { AuthCheckerGuard } from 'guards/auth-checker.guard';
import { getStatusCheckerGuard } from 'guards/user-status-checker.guard';
import { Role } from 'models/enums/role.enum';
import { UserStatus } from 'models/enums/user-status.enum';
import { Locale } from 'models/enums/locale.enum';
import { getLanguageHeader } from 'utils/request.utils';
import { FALLBACK_LANGUAGE } from 'constants/dict.constants';
import { ATTRIBUTE_ROUTES } from 'routes/attributes.routes';
import { AttributeService } from 'services/attribute.service';
import { ZodValidationPipe } from 'pipes/zod-validation.pipe';
import {
    CreateAttributeRequestDto,
    CreateAttributeSchema,
    UpdateAttributeRequestDto,
    UpdateAttributeSchema,
} from 'models/requests-schemas/create-attribute.request';

@UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
@Controller({ path: ATTRIBUTE_ROUTES.DEFAULT })
export class AttributesController {
    constructor(private readonly attributesService: AttributeService) {}

    @Get(ATTRIBUTE_ROUTES.GET_ALL_ATTRIBUTES)
    public async getAllAttributes(
        @Req() request: Request,
        @Query('name') name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.attributesService.getAllAttributes(name, page, limit, locale);
    }

    @Post(ATTRIBUTE_ROUTES.CREATE_ATTRIBUTE)
    public async createAttribute(@Body(new ZodValidationPipe(CreateAttributeSchema)) body: CreateAttributeRequestDto) {
        return this.attributesService.createAttribute(body);
    }

    @Delete(ATTRIBUTE_ROUTES.DELETE_ATTRIBUTE)
    public async deleteAttributeById(@Param('id') attributeId: string) {
        return this.attributesService.deleteAttribute(attributeId);
    }

    @Get(ATTRIBUTE_ROUTES.GET_ATTRIBUTE)
    public async getAttributeById(@Req() request: Request, @Param('id') attributeId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.attributesService.getAttribute(locale, attributeId);
    }

    @Patch(ATTRIBUTE_ROUTES.UPDATE_ATTRIBUTE)
    public async updateAttribute(
        @Param('id') attributeId: string,
        @Body(new ZodValidationPipe(UpdateAttributeSchema)) body: UpdateAttributeRequestDto,
    ) {
        return this.attributesService.updateAttribute(body, attributeId);
    }
}
