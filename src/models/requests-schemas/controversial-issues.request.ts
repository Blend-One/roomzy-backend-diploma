import { z } from 'zod';
import { getZodStringValidator } from '../../utils/zod.utils';
import { RENT_ERRORS } from '../../errors/rent.errors';

export const ControversialIssueSchema = z
    .object({
        descriptions: getZodStringValidator(RENT_ERRORS.CONTROVERSIAL_ISSUES_REQUIRED),
    })
    .required();

export type ControversialIssueDto = z.infer<typeof ControversialIssueSchema>;
