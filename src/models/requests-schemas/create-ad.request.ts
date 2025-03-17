import { z } from 'zod';
import { ROOM_ERRORS } from '../../errors/room.errors';
import { getZodBooleanValidator, getZodNumberValidator, getZodStringValidator } from '../../utils/zod.utils';

export const SectionRoomSchema = z
    .object({
        floorNumber: getZodNumberValidator(ROOM_ERRORS.FLOOR_NUMBER_IS_MISSED),
        roomSectionTypeId: getZodStringValidator(ROOM_ERRORS.SECTION_TYPE_IS_MISSED),
        sectionAttributeValues: z.object({}).passthrough(),
    })
    .array();

export type SectionRoomSchemaDto = z.infer<typeof SectionRoomSchema>;

export const CreateRoomSchema = z
    .object({
        title: getZodStringValidator(ROOM_ERRORS.TITLE_IS_MISSED).min(5).max(100),
        square: getZodNumberValidator(ROOM_ERRORS.SQUARE_IS_MISSED),
        price: getZodNumberValidator(ROOM_ERRORS.PRICE_IS_MISSED),
        priceUnit: getZodStringValidator(ROOM_ERRORS.PRICE_IS_MISSED),
        roomTypeId: getZodStringValidator(ROOM_ERRORS.ROOM_TYPE_IS_MISSED),
        physControlInstructions: z.string().optional(),
        accessInstructions: z.string().optional(),
        street: getZodStringValidator(ROOM_ERRORS.ADDRESS_IS_MISSED),
        cityId: getZodStringValidator(ROOM_ERRORS.ADDRESS_IS_MISSED),
        building: getZodNumberValidator(ROOM_ERRORS.ADDRESS_IS_MISSED),
        districtId: getZodStringValidator(ROOM_ERRORS.ADDRESS_IS_MISSED),
        hasDeposit: getZodBooleanValidator(ROOM_ERRORS.DEPOSIT_FLAG_IS_MISSED),
        isCommercial: getZodBooleanValidator(ROOM_ERRORS.COMMERCIAL_FLAG_IS_MISSED),
        lat: getZodNumberValidator(ROOM_ERRORS.COORDINATES_ARE_MISSED),
        lon: getZodNumberValidator(ROOM_ERRORS.COORDINATES_ARE_MISSED),
        appartment: z.string().optional(),
        sections: z.string().optional(),
        defaultOptions: z.string().optional(),
    })
    .optional();

export type CreateRoomRequestDto = z.infer<typeof CreateRoomSchema>;
