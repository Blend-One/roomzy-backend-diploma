import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable({})
export default class RentService {
    constructor(
        private roomRepository: RoomRepository,
        private rentRepository: RentRepository,
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
            isDeposit: true,
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
}
