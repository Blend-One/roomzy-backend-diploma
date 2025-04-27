export const RENT_ROUTES = {
    DEFAULT: 'rents',
    CREATE: '',
    CHANGE_RENT_STATUS_FOR_LANDLORD: 'landlord/status/:rentId',
    CHANGE_RENT_STATUS_FOR_RENTER: 'renter/status/:rentId',
    GET_PERSONAL_RENTS: 'personal',
    GET_RENTS_BY_ROOM: ':roomId',
    GET_INSTRUCTIONS: ':roomId/instructions',
    CREATE_CHECKOUT_SESSION: 'create_checkout',
} satisfies Record<string, string>;
