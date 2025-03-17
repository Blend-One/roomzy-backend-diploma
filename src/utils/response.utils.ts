import { Response } from 'express';

export const setCacheControlHeader = (response: Response, cacheControlValue) => {
    response.setHeader('Cache-Control', cacheControlValue);
};
