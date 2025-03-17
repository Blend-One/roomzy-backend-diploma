import { z } from 'zod';
import { AUTH_ERRORS } from 'errors/auth.errors';
import { getZodStringValidator } from '../../utils/zod.utils';

export const AuthSchema = z
    .object({
        email: getZodStringValidator(AUTH_ERRORS.INVALID_EMAIL).email(),
        password: getZodStringValidator(AUTH_ERRORS.INVALID_PASSWORD).min(8).max(64),
    })
    .required();

export type AuthRequestDto = z.infer<typeof AuthSchema>;
