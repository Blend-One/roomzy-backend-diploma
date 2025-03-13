import { getZodStringValidator } from '../../utils/zod.utils';
import { DETAILS_ERRORS } from '../../errors/details.errors';
import { z } from 'zod';

export const detailsRequest = {
    fallbackName: getZodStringValidator(DETAILS_ERRORS.FALLBACK_NAME_WAS_MISSED),
    ru: getZodStringValidator(DETAILS_ERRORS.NAMES_WERE_MISSED),
    kz: getZodStringValidator(DETAILS_ERRORS.NAMES_WERE_MISSED),
};

export const detailsRequestForUpdate = {
    fallbackName: getZodStringValidator(DETAILS_ERRORS.FALLBACK_NAME_WAS_MISSED).optional(),
    ru: getZodStringValidator(DETAILS_ERRORS.NAMES_WERE_MISSED).optional(),
    kz: getZodStringValidator(DETAILS_ERRORS.NAMES_WERE_MISSED).optional(),
};

export const DetailsRequestSchema = z.object(detailsRequest).optional();

export type DetailsRequestSchemaDto = z.infer<typeof DetailsRequestSchema>;

export const UpdateDetailsRequestSchema = z.object(detailsRequestForUpdate).optional();

export type UpdateDetailsRequestSchemaDto = z.infer<typeof UpdateDetailsRequestSchema>;
