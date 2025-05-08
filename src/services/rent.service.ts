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
import MailService from './mail.service';
import {
    newRentForLandlordMail,
    rentIsApprovedMail,
    rentIsRejectedMail,
    rentWasRejectedByRenterForLandlordMail,
} from '../mail-content/rents.mail-content';
import { mailTemplate } from '../templates/mail.templates';
import DocumentsRepository from '../repositories/documents.repository';
import DocumentsService from './documents.service';

@Injectable({})
export default class RentService {
    constructor(
        private roomRepository: RoomRepository,
        private rentRepository: RentRepository,
        private mailService: MailService,
        private documentsRepository: DocumentsRepository,
        private documentsService: DocumentsService,
        @Inject(PAYMENT_PROVIDER_KEY) private provider: PaymentProvider,
    ) {}

    async createRent(body: CreateRentSchemaDto, userId: string, userEmail: string) {
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

        const { title, description } = newRentForLandlordMail(userEmail, room.title);

        this.mailService.sendEmail({
            subject: title,
            html: mailTemplate(title, description),
            emailTo: room.userRelation.email,
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

    async getRentById(userId: string, rentId: string) {
        const foundRent = await this.rentRepository.getRentWithAttachedRoomById(rentId);
        if (![foundRent.userId, foundRent.room.userId].includes(userId)) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        delete foundRent.room.userId;

        return foundRent;
    }

    async changeStatusForLandlord(userId: string, rentId: string, status: RentStatus) {
        const foundRent = await this.rentRepository.getRentById(rentId);
        if (foundRent.room.userId !== userId) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        const availableStatuses: Record<RentStatus, RentStatus[]> = {
            [RentStatus.OPENED]: [RentStatus.IN_SIGNING_PROCESS, RentStatus.REJECTED],
            [RentStatus.PAID]: [],
            [RentStatus.REJECTED]: [],
            [RentStatus.PENDING]: [],
            [RentStatus.CLOSED]: [],
            [RentStatus.ISSUES_ON_CHECK]: [],
            [RentStatus.ISSUES_REJECTED]: [],
            [RentStatus.IN_SIGNING_PROCESS]: [RentStatus.CLOSED],
        };

        if (!availableStatuses[foundRent.rentStatus as RentStatus].includes(status)) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        let mailContent: { title: string; description: string };
        if (status === RentStatus.IN_SIGNING_PROCESS) {
            mailContent = rentIsApprovedMail(foundRent.room.title);
            const dataForTemplate = this.documentsService.createDataForTemplate(foundRent);
            await this.documentsRepository.createDocument(foundRent, dataForTemplate);
        } else {
            mailContent = rentIsRejectedMail(foundRent.room.title);
        }

        this.mailService.sendEmail({
            subject: mailContent.title,
            html: mailTemplate(mailContent.title, mailContent.description),
            emailTo: foundRent.user.email,
        });

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
            [RentStatus.PENDING]: [],
            [RentStatus.CLOSED]: [],
            [RentStatus.ISSUES_ON_CHECK]: [],
            [RentStatus.ISSUES_REJECTED]: [],
            [RentStatus.IN_SIGNING_PROCESS]: [RentStatus.CLOSED],
        };

        if (!availableStatuses[foundRent.rentStatus as RentStatus].includes(status)) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        if (foundRent.rentStatus === RentStatus.IN_SIGNING_PROCESS) {
            const { title, description } = rentWasRejectedByRenterForLandlordMail(
                foundRent.user.email,
                foundRent.room.title,
            );
            this.mailService.sendEmail({
                subject: title,
                html: mailTemplate(title, description),
                emailTo: foundRent.room.userRelation.email,
            });
        }

        return this.rentRepository.changeRentStatus({ rentId, status });
    }

    async getInstructions(rentId: string, userId: string, instructionsType: InstructionsType) {
        const foundRent = await this.rentRepository.getRentById(rentId);

        if (!foundRent) {
            throw new BadRequestException(RENT_ERRORS.RENT_NOT_FOUND);
        }

        if (foundRent.room.userId !== userId && foundRent.userId !== userId) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        const statusMapper = {
            [RentStatus.IN_SIGNING_PROCESS]:
                foundRent.room.userId === userId
                    ? [InstructionsType.PHYS_CONTROL, InstructionsType.ACCESS]
                    : [InstructionsType.PHYS_CONTROL],
            [RentStatus.PENDING]: [InstructionsType.PHYS_CONTROL, InstructionsType.ACCESS],
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
        const foundRent = await this.rentRepository.getRentById(rentId ?? '');
        if (!foundRent || foundRent.rentStatus !== RentStatus.PENDING || foundRent.userId !== userId) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        const sessionUrl = await this.provider.createPaymentSession({
            rentId: foundRent.id,
            amount: foundRent.totalPrice.toNumber(),
            productName: foundRent.room.title,
        });

        return { sessionUrl };
    }
}
