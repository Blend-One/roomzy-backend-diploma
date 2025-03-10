import { z } from 'zod';
import { detailsRequest, detailsRequestForUpdate } from './details.request';

export const CreateRoomTypeSchema = z
    .object({
        ...detailsRequest,
        sectionIds: z.string().array(),
    })
    .optional();

export type CreateRoomTypeRequestDto = z.infer<typeof CreateRoomTypeSchema>;

export const UpdateRoomTypeSchema = z
    .object({ ...detailsRequestForUpdate, sectionIds: z.string().array().optional() })
    .optional();

export type UpdateRoomTypeRequestDto = z.infer<typeof UpdateRoomTypeSchema>;
