import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentProvider } from '../interfaces/payment.interfaces';

@Injectable()
export class StripeProvider implements PaymentProvider {
    private stripe = new Stripe(process.env.PAYMENT_PROVIDER_STRIPE_KEY);

    async createPaymentSession({ amount, userId, productName }) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: process.env.PAYMENT_PROVIDER_CURRENCY,
                        product_data: { name: productName },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            client_reference_id: userId,
            success_url: process.env.PAYMENT_PROVIDER_SUCCESS_URL,
            cancel_url: process.env.PAYMENT_PROVIDER_CANCEL_URL,
        });

        return session.url!;
    }

    async handleWebhook(body: Buffer, signature: string): Promise<void> {}
}
