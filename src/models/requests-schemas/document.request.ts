import { getZodStringValidator } from '../../utils/zod.utils';
import { DOCUMENTS_ERRORS } from '../../errors/documents.errors';
import { z } from 'zod';

export const DocumentSignRequest = z.object({
    cms: getZodStringValidator(DOCUMENTS_ERRORS.CMS_IS_MISSED),
});

export type DocumentSignRequestDto = z.infer<typeof DocumentSignRequest>;
