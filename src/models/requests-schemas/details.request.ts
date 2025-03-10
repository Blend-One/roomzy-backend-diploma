import { getZodStringValidator } from '../../utils/zod.utils';
import { DETAILS_ERRORS } from '../../errors/details.errors';

export const detailsRequest = {
    fallbackName: getZodStringValidator(DETAILS_ERRORS.FALLBACK_NAME_WAS_MISSED).email(),
    ru: getZodStringValidator(DETAILS_ERRORS.NAMES_WERE_MISSED),
    kz: getZodStringValidator(DETAILS_ERRORS.NAMES_WERE_MISSED),
    en: getZodStringValidator(DETAILS_ERRORS.NAMES_WERE_MISSED).optional(),
};
