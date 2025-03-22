import { Response } from 'express';

export const setCacheControlHeader = (response: Response, cacheControlValue) => {
    response.setHeader('Cache-Control', cacheControlValue);
};

export const setXTotalCountHeader = (response: Response, count: number) => {
    response.setHeader('X-Total-Count', count);
};
