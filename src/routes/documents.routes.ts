export const DOCUMENTS_ROUTES = {
    DEFAULT: 'documents',
    SIGN: 'sign/:id',
    GET: ':id',
    GET_AS_FILE: 'pdf/:id',
} satisfies Record<string, string>;
