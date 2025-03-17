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
    DetailsRequestSchema,
    DetailsRequestSchemaDto,
    UpdateDetailsRequestSchema,
    UpdateDetailsRequestSchemaDto,
} from '../models/requests-schemas/details.request';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';
import { PaginationQueryParamsDocs } from '../decorators/pagination-query-params-docs.decorators';

@ApiBearerAuth()
@ApiTags(API_TAGS.ATTRIBUTES)
@UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
@Controller({ path: ATTRIBUTE_ROUTES.DEFAULT })
export class AttributesController {
    constructor(private readonly attributesService: AttributeService) {}

    @ApiOperation({
        summary: 'Get attributes',
    })
    @Get(ATTRIBUTE_ROUTES.GET_ALL_ATTRIBUTES)
    @PaginationQueryParamsDocs()
    @ApiQuery({ name: 'name', required: false, description: 'Name of attribute' })
    public async getAllAttributes(
        @Req() request: Request,
        @Query('name') name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.attributesService.getAllAttributes(name, page, limit, locale);
    }

    @ApiOperation({
        summary: 'Create attribute',
    })
    @Post(ATTRIBUTE_ROUTES.CREATE_ATTRIBUTE)
    public async createAttribute(@Body(new ZodValidationPipe(DetailsRequestSchema)) body: DetailsRequestSchemaDto) {
        return this.attributesService.createAttribute(body);
    }

    @ApiOperation({
        summary: 'Delete attribute',
    })
    @Delete(ATTRIBUTE_ROUTES.DELETE_ATTRIBUTE)
    public async deleteAttributeById(@Param('id') attributeId: string) {
        return this.attributesService.deleteAttribute(attributeId);
    }

    @ApiOperation({
        summary: 'Get single attribute',
    })
    @Get(ATTRIBUTE_ROUTES.GET_ATTRIBUTE)
    public async getAttributeById(@Req() request: Request, @Param('id') attributeId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.attributesService.getAttribute(locale, attributeId);
    }

    @ApiOperation({
        summary: 'Update attribute',
    })
    @Patch(ATTRIBUTE_ROUTES.UPDATE_ATTRIBUTE)
    public async updateAttribute(
        @Param('id') attributeId: string,
        @Body(new ZodValidationPipe(UpdateDetailsRequestSchema)) body: UpdateDetailsRequestSchemaDto,
    ) {
        return this.attributesService.updateAttribute(body, attributeId);
    }
}
