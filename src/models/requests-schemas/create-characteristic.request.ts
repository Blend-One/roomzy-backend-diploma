import { z } from 'zod';
import { detailsRequest } from './details.request';

export const CreateCharacteristicSchema = z
    .object({
        ...detailsRequest,
        attributeIds: z.string().array(),
    })
    .optional();

export type CreateCharacteristicRequestDto = z.infer<typeof CreateCharacteristicSchema>;
