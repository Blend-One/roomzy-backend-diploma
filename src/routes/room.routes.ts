export const ROOM_ROUTES = {
    DEFAULT: 'rooms',
    GET_ADS: '',
    GET_AD: ':id',
    CREATE_AD: '',
    UPDATE_AD: ':id',
    CHANGE_STATUS_OF_AD: 'status/:id',
    CHANGE_STATUS_OF_IN_MODERATION_AD: 'in_moderation_ad_status/:id',
    GET_MODERATION_ADS: 'moderation',
} satisfies Record<string, string>;
