import { z } from 'zod';
import { detailsRequest } from './details.request';

export const CreateAttributeSchema = z.object(detailsRequest).optional();

export type CreateAttributeRequestDto = z.infer<typeof CreateAttributeSchema>;
