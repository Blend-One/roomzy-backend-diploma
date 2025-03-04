import { z } from 'zod';
import { ROOM_ERRORS } from '../../errors/room.errors';

const SectionRoomSchema = z
    .object({
        floor: z.number({
            errorMap: () => ({
                message: ROOM_ERRORS.FLOOR_NUMBER_IS_MISSED,
            }),
        }),
        sectionTypeId: z.string({
            errorMap: () => ({
                message: ROOM_ERRORS.SECTION_TYPE_IS_MISSED,
            }),
        }),
    })
    .passthrough()
    .array();

export const CreateRoomSchema = z
    .object({
        title: z
            .string({
                errorMap: () => ({
                    message: ROOM_ERRORS.TITLE_IS_MISSED,
                }),
            })
            .min(5)
            .max(100),
        price: z.number({
            errorMap: () => ({
                message: ROOM_ERRORS.PRICE_IS_MISSED,
            }),
        }),
        priceUnit: z.string({
            errorMap: () => ({
                message: ROOM_ERRORS.PRICE_IS_MISSED,
            }),
        }),
        roomTypeId: z.string({
            errorMap: () => ({
                message: ROOM_ERRORS.ROOM_TYPE_IS_MISSED,
            }),
        }),
        physControlInstructions: z.string().optional(),
        accessInstructions: z.string().optional(),
        street: z.string({
            errorMap: () => ({
                message: ROOM_ERRORS.ADDRESS_IS_MISSED,
            }),
        }),
        cityId: z.string({
            errorMap: () => ({
                message: ROOM_ERRORS.ADDRESS_IS_MISSED,
            }),
        }),
        districtId: z.string({
            errorMap: () => ({
                message: ROOM_ERRORS.ADDRESS_IS_MISSED,
            }),
        }),
        isCommercial: z.boolean({
            errorMap: () => ({
                message: ROOM_ERRORS.COMMERCIAL_FLAG_IS_MISSED,
            }),
        }),
        lat: z.number({
            errorMap: () => ({
                message: ROOM_ERRORS.COORDINATES_ARE_MISSED,
            }),
        }),
        lon: z.number({
            errorMap: () => ({
                message: ROOM_ERRORS.COORDINATES_ARE_MISSED,
            }),
        }),
        appartment: z.string().optional(),
        sections: SectionRoomSchema.optional(),
    })
    .optional();

export type CreateRoomRequestDto = z.infer<typeof CreateRoomSchema>;
