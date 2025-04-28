import { z } from 'zod';
import { RENT_ERRORS } from 'errors/rent.errors';
import { getZodStringValidator } from '../../utils/zod.utils';

export const CreateRentSchema = z
    .object({
        roomId: getZodStringValidator(RENT_ERRORS.ROOM_ID_REQUIRED),
        issuedDate: getZodStringValidator(RENT_ERRORS.ISSUED_DATE_REQUIRED).datetime(),
        dueDate: getZodStringValidator(RENT_ERRORS.DUE_DATE_REQUIRED).datetime(),
    })
    .required();

export type CreateRentSchemaDto = z.infer<typeof CreateRentSchema>;
