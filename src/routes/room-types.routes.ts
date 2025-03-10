export const ROOM_TYPES_ROUTES = {
    DEFAULT: 'room_types',
    GET_DEFAULT_CHARACTERISTICS_BY_ROOM_TYPE: 'characteristics/default/:roomTypeId',
    GET_SECTIONS_AND_CHARS_BY_ROOM_TYPE: ':roomTypeId',
    CREATE_ROOM_TYPE: '',
    UPDATE_ROOM_TYPE: ':id',
} satisfies Record<string, string>;
