import { BadRequestException, Injectable, RawBodyRequest } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentProvider } from '../interfaces/payment.interfaces';
import { PAYMENT_ERRORS } from '../../errors/payment.errors';
import { RoomRepository } from '../../repositories/room.repository';
import RentRepository from '../../repositories/rent.repository';
import { RentStatus } from '../../models/enums/rent-status.enum';
import MailService from '../../services/mail.service';
import { rentIsSuccessfulMail } from '../../mail-content/rents.mail-content';
import { mailTemplate } from '../../templates/mail.templates';

const COEFFICIENT = 100;

@Injectable()
export class StripeProvider implements PaymentProvider {
    constructor(
        private roomRepository: RoomRepository,
        private rentRepository: RentRepository,
        private mailService: MailService,
    ) {}

    private stripe = new Stripe(process.env.PAYMENT_PROVIDER_STRIPE_KEY);

    async createPaymentSession({ amount, rentId, productName }) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: process.env.PAYMENT_PROVIDER_CURRENCY,
                        product_data: { name: productName },
                        unit_amount: amount * COEFFICIENT,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            client_reference_id: rentId,
            success_url: process.env.PAYMENT_PROVIDER_SUCCESS_URL,
            cancel_url: process.env.PAYMENT_PROVIDER_CANCEL_URL,
        });

        return session.url!;
    }

    async handleWebhook(req: Request): Promise<any> {
        let event: Stripe.Event;
        const signature = req.headers['stripe-signature'];
        const endpointSecret = process.env.PAYMENT_PROVIDER_ENDPOINT_SECRET;
        try {
            event = await this.stripe.webhooks.constructEvent((req as any).rawBody, signature, endpointSecret);
        } catch (err) {
            return new BadRequestException(PAYMENT_ERRORS.SIGNATURE_ERROR);
        }

        const session = event.data.object as Stripe.Checkout.Session;

        if (event.type === 'checkout.session.completed') {
            const rentId = session.client_reference_id;
            const rent = await this.rentRepository.getRentById(rentId);
            await this.rentRepository.changeRentStatus({ rentId, status: RentStatus.PAID });
            const { title, description } = rentIsSuccessfulMail(rent.room.title);
            [rent.user.email, rent.room.userRelation.email].forEach(emailTo => {
                this.mailService.sendEmail({ emailTo, html: mailTemplate(title, description), subject: title });
            });
        }
    }
}
