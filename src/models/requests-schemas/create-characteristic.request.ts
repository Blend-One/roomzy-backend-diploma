import { z } from 'zod';
import { detailsRequest, detailsRequestForUpdate } from './details.request';

export const CreateCharacteristicSchema = z
    .object({
        ...detailsRequest,
        attributeIds: z.string().array(),
    })
    .optional();

export type CreateCharacteristicRequestDto = z.infer<typeof CreateCharacteristicSchema>;

export const UpdateCharacteristicSchema = z
    .object({ ...detailsRequestForUpdate, attributeIds: z.string().array().optional() })
    .optional();

export type UpdateCharacteristicRequestDto = z.infer<typeof UpdateCharacteristicSchema>;
