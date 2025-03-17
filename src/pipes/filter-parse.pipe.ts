import { BadRequestException, PipeTransform } from '@nestjs/common';
import { FILTERS_ERRORS } from '../errors/filters.errors';
import { FILTER_PARSE_CONSTANTS } from '../constants/filter-parse.constants';

export class FilterParsePipe implements PipeTransform {
    transform(value: unknown) {
        try {
            const result = { ...(value as Record<string, any>) };
            FILTER_PARSE_CONSTANTS.forEach(constant => {
                if (result[constant]) {
                    result[constant] = JSON.parse(result[constant]);
                }
            });
            return result;
        } catch (error: unknown) {
            throw new BadRequestException(FILTERS_ERRORS.INVALID_FILTERS);
        }
    }
}
