import { z } from 'zod';

export const getZodStringValidator = (message: string) => {
    return z.string({
        errorMap: () => ({
            message,
        }),
    });
};

export const getZodBooleanValidator = (message: string) => {
    return z
        .string({
            errorMap: () => ({
                message,
            }),
        })
        .refine(val => ['true', 'false'].includes(val), {
            message,
        })
        .transform(val => val === 'true');
};

export const getZodNumberValidator = (message: string) => {
    return z
        .string({
            errorMap: () => ({
                message,
            }),
        })
        .refine(val => !isNaN(Number(val)), {
            message,
        })
        .transform(val => Number(val));
};
