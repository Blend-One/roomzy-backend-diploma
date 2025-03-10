import { z } from 'zod';
import { detailsRequest } from './details.request';

export const CreateRoomTypeSchema = z
    .object({
        ...detailsRequest,
        sectionIds: z.string().array(),
    })
    .optional();

export type CreateRoomTypeRequestDto = z.infer<typeof CreateRoomTypeSchema>;
