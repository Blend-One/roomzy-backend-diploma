import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function PaginationQueryParamsDocs() {
    return applyDecorators(
        ApiQuery({ name: 'page', required: false, description: 'Page number' }),
        ApiQuery({ name: 'limit', required: false, description: 'Items per page' }),
    );
}
