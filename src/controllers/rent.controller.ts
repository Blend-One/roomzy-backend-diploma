import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    RawBodyRequest,
    Req,
    UseGuards,
} from '@nestjs/common';
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
import { PAYMENT_PROVIDER_KEY } from '../payment/payment.module';
import { PaymentProvider } from '../payment/interfaces/payment.interfaces';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { API_TAGS } from '../constants/api-tags.constants';
import { CreateRentDto } from '../api-bodies/create-rent.api-body';
import { CreateRentResponseDto, RentResponseDto } from '../api-bodies/rent-response.api-body';
import { PaginationQueryParamsDocs } from '../decorators/pagination-query-params-docs.decorators';
import { RentStatusDto } from '../api-bodies/status.api-body';
import { InstructionsDto } from '../api-bodies/instruction.api-body';
import { CheckoutURLDto } from '../api-bodies/checkout-url.api-body';

@ApiBearerAuth()
@ApiTags(API_TAGS.RENTS)
@Controller({ path: RENT_ROUTES.DEFAULT })
export class RentController {
    constructor(
        private rentService: RentService,
        @Inject(PAYMENT_PROVIDER_KEY) private paymentProvider: PaymentProvider,
    ) {}

    @ApiOperation({ summary: 'Create rent' })
    @ApiBody({ type: CreateRentDto })
    @ApiCreatedResponse({ type: CreateRentResponseDto })
    @Post(RENT_ROUTES.CREATE)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async createRent(
        @Body(new ZodValidationPipe(CreateRentSchema)) body: CreateRentSchemaDto,
        @Req() request: Request,
    ) {
        const user = getUserHeader(request);
        return this.rentService.createRent(body, user.id, user.email);
    }

    @PaginationQueryParamsDocs()
    @ApiOperation({
        summary: 'Get personal rents (for renters)',
    })
    @ApiQuery({
        name: 'status',
        description: 'Status of acquired rents',
        required: false,
        type: String,
    })
    @ApiOkResponse({ type: [RentResponseDto] })
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

    @PaginationQueryParamsDocs()
    @ApiOperation({
        summary: 'Get rents by roomId (for landlords)',
    })
    @ApiQuery({
        name: 'status',
        description: 'Status of acquired rents',
        required: false,
        type: String,
    })
    @ApiOkResponse({ type: [RentResponseDto] })
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

    @ApiOperation({
        summary: 'Update status of rent (for landlords)',
    })
    @ApiBody({ type: RentStatusDto })
    @ApiOkResponse({ type: CreateRentResponseDto })
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

    @ApiOperation({
        summary: 'Update status of rent (for renters)',
    })
    @ApiBody({ type: RentStatusDto })
    @ApiOkResponse({ type: CreateRentResponseDto })
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

    @ApiOperation({
        summary: "Get specific room's instruction",
    })
    @ApiParam({
        name: 'type',
        enum: InstructionsType,
        description: "Instruction's type. Should be either 'access' or 'phys_control'",
        required: true,
    })
    @ApiOkResponse({ type: InstructionsDto })
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

    @ApiOperation({
        summary: 'Create checkout session for payment',
    })
    @ApiOkResponse({ type: CheckoutURLDto })
    @Post(RENT_ROUTES.CREATE_CHECKOUT_SESSION)
    @UseGuards(AuthCheckerGuard, getStatusCheckerGuard([Role.USER], UserStatus.ACTIVE))
    public async createCheckoutSession(@Req() request: Request, @Param('rentId') rentId: string) {
        const user = getUserHeader(request);
        return this.rentService.createCheckoutSession(rentId, user.id);
    }

    @ApiOperation({
        summary: 'Only for 3rd parties. Not required to use this API',
    })
    @Post(RENT_ROUTES.HANDLE_WEBHOOK)
    public async handlePaymentWebhook(@Req() req: RawBodyRequest<Request>) {
        await this.paymentProvider.handleWebhook(req);
    }
}
