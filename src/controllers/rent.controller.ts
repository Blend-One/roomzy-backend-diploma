import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RENT_ROUTES } from 'routes/rent.routes';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CreateRentSchema, CreateRentSchemaDto } from '../models/requests-schemas/rent.request';
import RentService from '../services/rent.service';
import { AuthCheckerGuard } from '../guards/auth-checker.guard';
import { getStatusCheckerGuard } from '../guards/user-status-checker.guard';
import { Role } from '../models/enums/role.enum';
import { UserStatus } from '../models/enums/user-status.enum';
import { getUserHeader } from '../utils/request.utils';
import { RentStatus } from '../models/enums/rent-status.enum';
import { InstructionsType } from '../models/enums/instructions-type.enum';

@Controller({ path: RENT_ROUTES.DEFAULT })
export class RentController {
    constructor(private rentService: RentService) {}

    @Post(RENT_ROUTES.CREATE)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async createRent(
        @Body(new ZodValidationPipe(CreateRentSchema)) body: CreateRentSchemaDto,
        @Req() request: Request,
    ) {
        const user = getUserHeader(request);
        return this.rentService.createRent(body, user.id);
    }

    @Get(RENT_ROUTES.GET_PERSONAL_RENTS)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async getPersonalRents(
        @Req() request: Request,
        @Query('status') status: RentStatus,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const user = getUserHeader(request);
        return this.rentService.getPersonalRents(user.id, status, page, limit);
    }

    @Get(RENT_ROUTES.GET_RENTS_BY_ROOM)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async getRentsByRoom(
        @Req() request: Request,
        @Param('roomId') roomId: string,
        @Query('status') status: RentStatus,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const user = getUserHeader(request);
        return this.rentService.getRentsByRoomForLandlord(roomId, status, user.id, page, limit);
    }

    @Patch(RENT_ROUTES.CHANGE_RENT_STATUS_FOR_LANDLORD)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async changeRentStatusForLandLord(
        @Req() request: Request,
        @Param('rentId') rentId: string,
        @Body() body: { status: RentStatus },
    ) {
        const user = getUserHeader(request);
        return this.rentService.changeStatusForLandlord(user.id, rentId, body.status);
    }

    @Patch(RENT_ROUTES.CHANGE_RENT_STATUS_FOR_RENTER)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async changeRentStatusForRenter(
        @Req() request: Request,
        @Param('rentId') rentId: string,
        @Body() body: { status: RentStatus },
    ) {
        const user = getUserHeader(request);
        return this.rentService.changeStatusForRenter(user.id, rentId, body.status);
    }

    @Get(RENT_ROUTES.GET_INSTRUCTIONS)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async getInstructions(
        @Req() request: Request,
        @Param('rentId') rentId: string,
        @Param('type') instructionsType: InstructionsType,
    ) {
        const user = getUserHeader(request);
        return this.rentService.getInstructions(rentId, user.id, instructionsType);
    }

    @Post(RENT_ROUTES.CREATE_CHECKOUT_SESSION)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async createCheckoutSession(@Req() request: Request, @Body() body: { rentId: string }) {
        const user = getUserHeader(request);
        return this.rentService.createCheckoutSession(body.rentId, user.id);
    }
}
