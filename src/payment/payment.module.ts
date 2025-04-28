import { Module } from '@nestjs/common';
import { StripeProvider } from './providers/stripe.providers';

export const PAYMENT_PROVIDER_KEY = 'PAYMENT_PROVIDER';

@Module({
    providers: [
        {
            provide: PAYMENT_PROVIDER_KEY,
            useClass: StripeProvider,
        },
    ],
    exports: [
        {
            provide: PAYMENT_PROVIDER_KEY,
            useClass: StripeProvider,
        },
    ],
})
export default class PaymentModule {}
