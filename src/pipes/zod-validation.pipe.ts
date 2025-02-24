import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { resolveZodError } from 'utils/resolve-zod-error.utils';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown) {
        try {
            return this.schema.parse(value);
        } catch (error: unknown) {
            throw new BadRequestException(resolveZodError(error as ZodError));
        }
    }
}
