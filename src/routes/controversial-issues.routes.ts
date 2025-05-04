export const CONTROVERSIAL_ISSUES_ROUTES = {
    DEFAULT: 'controversial_issues',
    CREATE: ':rentId',
    GET_BY_RENT_ID: 'rents/:rentId',
    GET_BY_ROOM_ID: 'rooms/:roomId',
    GET_FOR_MODERATION: 'moderation',
    CHANGE_STATUS_FOR_MODERATION: 'moderation/change_status/:rentId',
} satisfies Record<string, string>;
