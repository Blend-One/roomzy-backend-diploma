export const ROOM_ROUTES = {
    DEFAULT: 'rooms',
    GET_ADS: '',
    CREATE_AD: '',
    UPDATE_AD: ':id',
    CHANGE_STATUS_OF_AD: 'status',
    GET_MODERATION_ADS: 'moderation',
} satisfies Record<string, string>;
