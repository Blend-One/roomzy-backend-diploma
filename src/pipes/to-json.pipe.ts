import { BadRequestException, PipeTransform } from '@nestjs/common';
import { FILTERS_ERRORS } from '../errors/filters.errors';

export class ToJsonPipe implements PipeTransform {
    transform(value: string) {
        try {
            return value ? JSON.parse(value) : {};
        } catch (error: unknown) {
            throw new BadRequestException(FILTERS_ERRORS.INVALID_FILTERS);
        }
    }
}
