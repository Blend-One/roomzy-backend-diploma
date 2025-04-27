import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RENT_ROUTES } from 'routes/rent.routes';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CreateRentSchema, CreateRentSchemaDto } from '../models/requests-schemas/rent.request';
import RentService from '../services/rent.service';
import { AuthCheckerGuard } from '../guards/auth-checker.guard';
import { getStatusCheckerGuard } from '../guards/user-status-checker.guard';
import { Role } from '../models/enums/role.enum';
import { UserStatus } from '../models/enums/user-status.enum';
import { getUserHeader } from '../utils/request.utils';

@Controller({ path: RENT_ROUTES.DEFAULT })
export class RentController {
    constructor(private rentService: RentService) {}

    @Post(RENT_ROUTES.CREATE)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    createRent(@Body(new ZodValidationPipe(CreateRentSchema)) body: CreateRentSchemaDto, @Req() request: Request) {
        const user = getUserHeader(request);
        return this.rentService.createRent(body, user.id);
    }

    @Get(RENT_ROUTES.GET_RENTS_BY_ROOM)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    getRentsByRoom(@Req() request: Request, @Query('page') page?: number, @Query('limit') limit?: number) {
        const user = getUserHeader(request);
    }

    @Get(RENT_ROUTES.GET_PERSONAL_RENTS)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    getPersonalRents(@Req() request: Request, @Query('page') page?: number, @Query('limit') limit?: number) {
        const user = getUserHeader(request);
    }
}
