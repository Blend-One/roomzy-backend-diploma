import { DEFAULT_API_ROUTE } from './api.routes';

export const USER_ROUTES = {
    DEFAULT: `${DEFAULT_API_ROUTE}/users`,
    LOGIN: 'login',
    REGISTRATION: 'registration',
    REFRESH: 'refresh',
    LOGOUT: 'logout',
} satisfies Record<string, string>;
