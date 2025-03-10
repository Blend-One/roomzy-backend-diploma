import { z } from 'zod';
import { detailsRequest, detailsRequestForUpdate } from './details.request';

export const CreateAttributeSchema = z.object(detailsRequest).optional();

export type CreateAttributeRequestDto = z.infer<typeof CreateAttributeSchema>;

export const UpdateAttributeSchema = z.object(detailsRequestForUpdate).optional();

export type UpdateAttributeRequestDto = z.infer<typeof UpdateAttributeSchema>;
