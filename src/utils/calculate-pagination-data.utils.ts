import { LIMIT, PAGE } from '../constants/paginated.constants';

export const calculatePaginationData = (page: number, limit: number) => {
    const transformedPage = page ? Number(page) : PAGE;
    const transformedLimit = limit ? Number(limit) : LIMIT;
    const skip = transformedPage * transformedLimit - transformedLimit;
    const take = transformedLimit;
    return { skip, take };
};
