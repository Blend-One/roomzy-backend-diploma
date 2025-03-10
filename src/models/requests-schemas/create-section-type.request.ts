import { z } from 'zod';
import { detailsRequest } from './details.request';

export const CreateSectionTypeSchema = z
    .object({
        ...detailsRequest,
        characteristicIds: z.string().array(),
    })
    .optional();

export type CreateSectionTypeRequestDto = z.infer<typeof CreateSectionTypeSchema>;
