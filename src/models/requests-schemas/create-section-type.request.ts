import { z } from 'zod';
import { detailsRequest, detailsRequestForUpdate } from './details.request';

export const CreateSectionTypeSchema = z
    .object({
        ...detailsRequest,
        characteristicIds: z.string().array(),
    })
    .optional();

export type CreateSectionTypeRequestDto = z.infer<typeof CreateSectionTypeSchema>;

export const UpdateSectionTypeSchema = z
    .object({ ...detailsRequestForUpdate, characteristicIds: z.string().array().optional() })
    .optional();

export type UpdateSectionTypeRequestDto = z.infer<typeof UpdateSectionTypeSchema>;
