import { LIMIT, PAGE } from '../constants/paginated.constants';

export const calculatePaginationData = (page: number = PAGE, limit: number = LIMIT) => {
    const skip = page * limit - limit;
    const take = limit;
    return { skip, take };
};
