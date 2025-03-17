import { Controller, Get, Query, Req, Param, UseGuards, Body, Post, Patch, Delete } from '@nestjs/common';
import { AuthCheckerGuard } from 'guards/auth-checker.guard';
import { getStatusCheckerGuard } from 'guards/user-status-checker.guard';
import { Role } from 'models/enums/role.enum';
import { UserStatus } from 'models/enums/user-status.enum';
import { Locale } from 'models/enums/locale.enum';
import { getLanguageHeader } from 'utils/request.utils';
import { FALLBACK_LANGUAGE } from 'constants/dict.constants';
import { ZodValidationPipe } from 'pipes/zod-validation.pipe';
import { SECTION_TYPES_ROUTES } from 'routes/section-types.routes';
import { SectionTypesService } from '../services/section-types.service';
import {
    CreateSectionTypeRequestDto,
    CreateSectionTypeSchema,
    UpdateSectionTypeRequestDto,
    UpdateSectionTypeSchema,
} from '../models/requests-schemas/create-section-type.request';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';

@ApiTags(API_TAGS.SECTION_TYPES)
@UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.MANAGER], UserStatus.ACTIVE))
@Controller({ path: SECTION_TYPES_ROUTES.DEFAULT })
export class SectionTypesController {
    constructor(private readonly sectionTypeService: SectionTypesService) {}

    @Get(SECTION_TYPES_ROUTES.GET_ALL_SECTION_TYPES)
    public async getAllSectionTypes(
        @Req() request: Request,
        @Query('name') name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.sectionTypeService.getAllSectionTypes(name, page, limit, locale);
    }

    @Post(SECTION_TYPES_ROUTES.CREATE_SECTION_TYPE)
    public async createSectionType(
        @Body(new ZodValidationPipe(CreateSectionTypeSchema)) body: CreateSectionTypeRequestDto,
    ) {
        return this.sectionTypeService.createSectionType(body);
    }

    @Delete(SECTION_TYPES_ROUTES.DELETE_SECTION_TYPE)
    public async deleteSectionTypeById(@Param('id') characteristicId: string) {
        return this.sectionTypeService.deleteSectionType(characteristicId);
    }

    @Get(SECTION_TYPES_ROUTES.GET_SECTION_TYPE)
    public async getSectionTypeById(@Req() request: Request, @Param('id') sectionTypeId: string) {
        const locale = Locale[getLanguageHeader(request)] || FALLBACK_LANGUAGE;
        return this.sectionTypeService.getSectionType(locale, sectionTypeId);
    }

    @Patch(SECTION_TYPES_ROUTES.UPDATE_SECTION_TYPE)
    public async updateSectionType(
        @Param('id') attributeId: string,
        @Body(new ZodValidationPipe(UpdateSectionTypeSchema)) body: UpdateSectionTypeRequestDto,
    ) {
        return this.sectionTypeService.updateSectionType(body, attributeId);
    }
}
