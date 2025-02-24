import { z } from 'zod';
import { AUTH_ERRORS } from 'errors/auth.errors';

export const AuthSchema = z
    .object({
        email: z
            .string({
                errorMap: () => ({
                    message: AUTH_ERRORS.INVALID_EMAIL,
                }),
            })
            .email(),
        password: z
            .string({
                errorMap: () => ({
                    message: AUTH_ERRORS.INVALID_PASSWORD,
                }),
            })
            .min(8)
            .max(64),
    })
    .required();

export type AuthRequestDto = z.infer<typeof AuthSchema>;
