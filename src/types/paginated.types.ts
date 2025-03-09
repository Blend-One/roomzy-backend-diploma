export type Paginated<T extends Record<string, any>> = {
    page: number;
    limit: number;
    orderBy: 'ASC' | 'DESC';
} & T;
