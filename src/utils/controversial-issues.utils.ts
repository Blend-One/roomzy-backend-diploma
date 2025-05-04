import { BadRequestException } from '@nestjs/common';
import { RENT_ERRORS } from '../errors/rent.errors';
import { MAX_COUNT } from '../constants/file.constants';

export const checkAreDescriptionsValid = (descriptions: string): Array<{ description: string }> => {
    try {
        const jsonRepresentation = JSON.parse(descriptions);
        const isArray = Array.isArray(jsonRepresentation);
        if (!isArray || (isArray && jsonRepresentation.length > MAX_COUNT)) {
            throw new Error();
        }

        jsonRepresentation.forEach(arrElement => {
            if (!arrElement?.description) {
                throw new Error();
            }
        });

        return jsonRepresentation;
    } catch (err) {
        throw new BadRequestException(RENT_ERRORS.CONTROVERSIAL_ISSUES_REQUIRED);
    }
};
