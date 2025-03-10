export const CHARACTERISTICS_ROUTES = {
    DEFAULT: 'characteristics',
    GET_ALL_CHARACTERISTICS: '',
    GET_CHARACTERISTIC: ':id',
    CREATE_CHARACTERISTIC: '',
    UPDATE_CHARACTERISTIC: ':id',
    DELETE_CHARACTERISTIC: ':id',
} satisfies Record<string, string>;
