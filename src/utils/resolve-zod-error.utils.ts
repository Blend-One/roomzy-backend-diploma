import { ZodError } from 'zod';

export const resolveZodError = (error: ZodError) => {
    const { issues } = error;
    console.log(issues);
    const [currentIssue] = issues;
    return currentIssue.message;
};
