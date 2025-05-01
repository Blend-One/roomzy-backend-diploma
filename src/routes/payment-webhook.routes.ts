import { RENT_ROUTES } from './rent.routes';

export const PAYMENT_WEBHOOKS = {
    RENT_WEBHOOK: `${RENT_ROUTES.DEFAULT}/${RENT_ROUTES.HANDLE_WEBHOOK}`,
} satisfies Record<string, string>;
