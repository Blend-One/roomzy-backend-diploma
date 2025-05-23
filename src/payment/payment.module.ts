import { Module } from '@nestjs/common';
import { StripeProvider } from './providers/stripe.providers';
import { PrismaService } from '../services/prisma.service';
import { RoomRepository } from '../repositories/room.repository';
import RentRepository from '../repositories/rent.repository';
import MailService from '../services/mail.service';

export const PAYMENT_PROVIDER_KEY = 'PAYMENT_PROVIDER';

@Module({
    providers: [
        {
            provide: PAYMENT_PROVIDER_KEY,
            useClass: StripeProvider,
        },
        PrismaService,
        RoomRepository,
        RentRepository,
        MailService,
    ],
    exports: [
        {
            provide: PAYMENT_PROVIDER_KEY,
            useClass: StripeProvider,
        },
    ],
})
export default class PaymentModule {}
