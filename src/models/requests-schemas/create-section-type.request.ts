import { z } from 'zod';
import { detailsRequest, detailsRequestForUpdate } from './details.request';
import { getZodStringValidator } from '../../utils/zod.utils';
import { DETAILS_ERRORS } from '../../errors/details.errors';

export const CreateSectionTypeSchema = z
    .object({
        ...detailsRequest,
        characteristicIds: getZodStringValidator(DETAILS_ERRORS.IDS_ARE_REQUIRED).array(),
    })
    .optional();

export type CreateSectionTypeRequestDto = z.infer<typeof CreateSectionTypeSchema>;

export const UpdateSectionTypeSchema = z
    .object({ ...detailsRequestForUpdate, characteristicIds: z.string().array().optional() })
    .optional();

export type UpdateSectionTypeRequestDto = z.infer<typeof UpdateSectionTypeSchema>;
