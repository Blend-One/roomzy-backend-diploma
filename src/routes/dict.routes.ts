export const DICT_ROUTES = {
    DEFAULT: 'dictionaries',
    GET_CITIES: 'cities',
    ADD_CITY: 'cities',
    UPDATE_CITY: 'cities',
    GET_DISTRICTS: 'districts/:cityId',
    ADD_DISTRICT: 'districts',
    UPDATE_DISTRICT: 'districts',
} satisfies Record<string, string>;
