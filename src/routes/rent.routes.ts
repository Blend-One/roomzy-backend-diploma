export const RENT_ROUTES = {
    DEFAULT: 'rents',
    CREATE: '',
    CHANGE_RENT_STATUS_FOR_LANDLORD: 'landlord/status/:rentId',
    CHANGE_RENT_STATUS_FOR_RENTER: 'renter/status/:rentId',
    GET_PERSONAL_RENTS: 'personal',
    GET_RENTS_BY_ROOM: ':roomId',
    GET_RENT_BY_ID: 'single/:rentId',
    GET_INSTRUCTIONS: ':rentId/instructions/:type',
    CREATE_CHECKOUT_SESSION: 'create_checkout/:rentId',
    HANDLE_WEBHOOK: 'payment_webhook',
} satisfies Record<string, string>;
