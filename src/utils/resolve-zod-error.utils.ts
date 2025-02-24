import { ZodError } from 'zod';

export const resolveZodError = (error: ZodError) => {
    const { issues } = error;
    const currentIssue = issues[0];
    return currentIssue.message;
};
