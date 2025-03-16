import { z } from 'zod';
import { getZodBooleanValidator, getZodNumberValidator, getZodStringValidator } from '../../utils/zod.utils';
import { ROOM_ERRORS } from '../../errors/room.errors';

export const UpdateRoomSchema = z
    .object({
        title: getZodStringValidator(ROOM_ERRORS.TITLE_IS_MISSED).min(5).max(100).optional(),
        square: getZodNumberValidator(ROOM_ERRORS.SQUARE_IS_MISSED).optional(),
        price: getZodNumberValidator(ROOM_ERRORS.PRICE_IS_MISSED).optional(),
        priceUnit: getZodStringValidator(ROOM_ERRORS.PRICE_IS_MISSED).optional(),
        roomTypeId: getZodStringValidator(ROOM_ERRORS.ROOM_TYPE_IS_MISSED).optional(),
        physControlInstructions: z.string().optional(),
        accessInstructions: z.string().optional(),
        street: getZodStringValidator(ROOM_ERRORS.ADDRESS_IS_MISSED).optional(),
        cityId: getZodStringValidator(ROOM_ERRORS.ADDRESS_IS_MISSED).optional(),
        building: getZodNumberValidator(ROOM_ERRORS.ADDRESS_IS_MISSED).optional(),
        districtId: getZodStringValidator(ROOM_ERRORS.ADDRESS_IS_MISSED).optional(),
        hasDeposit: getZodBooleanValidator(ROOM_ERRORS.DEPOSIT_FLAG_IS_MISSED).optional(),
        isCommercial: getZodBooleanValidator(ROOM_ERRORS.COMMERCIAL_FLAG_IS_MISSED).optional(),
        lat: getZodNumberValidator(ROOM_ERRORS.COORDINATES_ARE_MISSED).optional(),
        lon: getZodNumberValidator(ROOM_ERRORS.COORDINATES_ARE_MISSED).optional(),
        appartment: z.string().optional(),
        sections: z.string().optional(),
        defaultOptions: z.string().optional(),
        sectionsToDelete: z.string().optional(),
        imagesToDelete: z.string().optional(),
    })
    .optional();

export type UpdateRoomRequestDto = z.infer<typeof UpdateRoomSchema>;
