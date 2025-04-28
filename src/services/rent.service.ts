import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateRentSchemaDto } from '../models/requests-schemas/rent.request';
import { getTotalPrice } from '../utils/price.utils';
import { PriceUnit } from '../models/enums/price-unit.enum';
import { datesRangeValid, issuedDateIsValid } from '../utils/date.utils';
import { RENT_ERRORS } from '../errors/rent.errors';
import { RoomRepository } from '../repositories/room.repository';
import { ROOM_ERRORS } from '../errors/room.errors';
import RentRepository from '../repositories/rent.repository';
import { calculatePaginationData } from '../utils/calculate-pagination-data.utils';
import { RentStatus } from '../models/enums/rent-status.enum';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { InstructionsType } from '../models/enums/instructions-type.enum';
import { PAYMENT_PROVIDER_KEY } from '../payment/payment.module';
import { PaymentProvider } from '../payment/interfaces/payment.interfaces';
import { RoomStatus } from '../models/enums/room-status.enum';

@Injectable({})
export default class RentService {
    constructor(
        private roomRepository: RoomRepository,
        private rentRepository: RentRepository,
        @Inject(PAYMENT_PROVIDER_KEY) private provider: PaymentProvider,
    ) {}

    async createRent(body: CreateRentSchemaDto, userId: string) {
        const { roomId, issuedDate, dueDate } = body;

        const room = await this.roomRepository.getActiveAdForRentCreation(roomId);

        if (!room || room.userId === userId) {
            throw new BadRequestException(ROOM_ERRORS.ROOM_NOT_FOUND);
        }

        if (!(issuedDateIsValid(issuedDate) && datesRangeValid(issuedDate, dueDate, room.priceUnit as PriceUnit))) {
            throw new BadRequestException(RENT_ERRORS.INVALID_DATES);
        }

        const existingRent = await this.rentRepository.checkExistingRent(roomId, userId);

        if (existingRent) {
            throw new BadRequestException(RENT_ERRORS.RENT_ALREADY_EXISTS);
        }

        const totalPrice = getTotalPrice({
            issuedDate: body.issuedDate,
            dueDate: body.dueDate,
            isDeposit: room.hasDeposit,
            price: room.price.toNumber(),
            priceUnit: room.priceUnit as PriceUnit,
        });

        return this.rentRepository.createRent({
            dueDate,
            issuedDate,
            roomId,
            userId,
            totalPrice,
        });
    }

    async getPersonalRents(userId: string, status: RentStatus, page: number, limit: number) {
        const { take, skip } = calculatePaginationData(page, limit);
        return this.rentRepository.getRentsByUserId(userId, status, take, skip);
    }

    async getRentsByRoomForLandlord(roomId: string, status: RentStatus, userId: string, page: number, limit: number) {
        const room = await this.roomRepository.getActiveAdForRentCreation(roomId);
        if (!room || room.userId !== userId) {
            throw new BadRequestException(ROOM_ERRORS.ROOM_NOT_FOUND);
        }
        const { take, skip } = calculatePaginationData(page, limit);
        return this.rentRepository.getRentsByRoomId(roomId, status, take, skip);
    }

    async changeStatusForLandlord(userId: string, rentId: string, status: RentStatus) {
        const foundRent = await this.rentRepository.getRentById(rentId);
        if (foundRent.room.userId !== userId) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        const availableStatuses: Record<RentStatus, RentStatus[]> = {
            [RentStatus.OPENED]: [RentStatus.PENDING, RentStatus.REJECTED],
            [RentStatus.PAID]: [],
            [RentStatus.REJECTED]: [],
            [RentStatus.PENDING]: [RentStatus.CLOSED],
            [RentStatus.CLOSED]: [],
            [RentStatus.ISSUES_ON_CHECK]: [],
        };

        if (!availableStatuses[foundRent.rentStatus as RentStatus].includes(status)) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        return this.rentRepository.changeRentStatus({ rentId, status });
    }

    async changeStatusForRenter(userId: string, rentId: string, status: RentStatus) {
        const foundRent = await this.rentRepository.getRentById(rentId);
        if (foundRent.userId !== userId) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        const availableStatuses: Record<RentStatus, RentStatus[]> = {
            [RentStatus.OPENED]: [RentStatus.CLOSED],
            [RentStatus.PAID]: [],
            [RentStatus.REJECTED]: [],
            [RentStatus.PENDING]: [RentStatus.CLOSED],
            [RentStatus.CLOSED]: [],
            [RentStatus.ISSUES_ON_CHECK]: [],
        };

        if (!availableStatuses[foundRent.rentStatus as RentStatus].includes(status)) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        return this.rentRepository.changeRentStatus({ rentId, status });
    }

    async getInstructions(rentId: string, userId: string, instructionsType: InstructionsType) {
        const foundRent = await this.rentRepository.getRentById(rentId);

        if (foundRent.room.userId !== userId && foundRent.userId !== userId) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        const statusMapper = {
            [RentStatus.PENDING]: [InstructionsType.PHYS_CONTROL],
            [RentStatus.PAID]: [InstructionsType.PHYS_CONTROL, InstructionsType.ACCESS],
        };

        if (!statusMapper[foundRent.rentStatus]?.includes(instructionsType)) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        const instructionsTypeMapper: Record<InstructionsType, string> = {
            [InstructionsType.PHYS_CONTROL]: 'physControlInstructions',
            [InstructionsType.ACCESS]: 'accessInstructions',
        };

        return { instructions: foundRent.room[instructionsTypeMapper[instructionsType]] ?? null };
    }

    async createCheckoutSession(rentId: string, userId: string) {
        const foundRent = await this.rentRepository.getRentById(rentId);
        if (foundRent.rentStatus !== RentStatus.PENDING && foundRent.userId !== userId) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }
        const sessionUrl = await this.provider.createPaymentSession({
            userId,
            amount: foundRent.totalPrice.toNumber(),
            productName: foundRent.room.title,
        });

        return { sessionUrl };
    }
}
