export const ATTRIBUTE_ROUTES = {
    DEFAULT: 'attributes',
    GET_ALL_ATTRIBUTES: '',
    GET_ATTRIBUTE: ':id',
    DELETE_ATTRIBUTE: ':id',
    CREATE_ATTRIBUTE: '',
    UPDATE_ATTRIBUTE: ':id',
} satisfies Record<string, string>;
