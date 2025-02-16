import { z } from 'zod';

export const AuthSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8).max(64),
    })
    .required();

export type AuthRequestDto = z.infer<typeof AuthSchema>;
