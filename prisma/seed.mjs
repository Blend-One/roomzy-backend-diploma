import { PrismaClient } from '@prisma/client';
import { roles } from './seed_data/roles.mjs';
import { rentStatuses } from './seed_data/rent-statuses.mjs';
import { priceUnits } from './seed_data/price-units.mjs';
import { roomStatuses } from './seed_data/room-statuses.mjs';
import { citiesNDistricts } from './seed_data/cities-n-districts.mjs';
import { roomTypes, sectionTypes } from './seed_data/room-types.mjs';
import { roomAttributes, roomCharacteristics } from './seed_data/room-attribute-types.mjs';

const prisma = new PrismaClient();

const getQueryParams = ({ field, shouldUpsertId, additionalParams, overrideDefaultParams }) => {
    let params = overrideDefaultParams
        ? {}
        : {
              name: field,
          };

    if (shouldUpsertId) {
        params.id = field;
    }

    params = { ...params, ...additionalParams };

    return params;
};

async function upsertDictData({
    data,
    shouldUpsertId,
    columnName,
    getAdditionalParams,
    additionalCallback,
    overrideDefaultParams,
}) {
    for (const field of data) {
        const queryParams = getQueryParams({
            field,
            shouldUpsertId,
            additionalParams: getAdditionalParams?.(field) ?? undefined,
            overrideDefaultParams,
        });
        await prisma[columnName].upsert({
            where: queryParams,
            update: {},
            create: queryParams,
        });
        await additionalCallback?.(field);
    }
}

async function main() {
    await Promise.all([
        upsertDictData({ data: roles, shouldUpsertId: true, columnName: 'role' }),
        upsertDictData({ data: rentStatuses, columnName: 'rentStatus' }),
        upsertDictData({ data: priceUnits, columnName: 'priceUnit' }),
        upsertDictData({ data: roomStatuses, columnName: 'roomStatus' }),
        upsertDictData({
            data: citiesNDistricts,
            columnName: 'city',
            getAdditionalParams: field => ({
                ru: field.ru,
                fallbackName: field.ru,
                kz: field.kz,
                id: field.en.toUpperCase(),
            }),
            overrideDefaultParams: true,
            additionalCallback: async field => {
                return upsertDictData({
                    data: field.districts,
                    columnName: 'district',
                    getAdditionalParams: districtField => ({
                        ru: districtField.ru,
                        kz: districtField.kz,
                        fallbackName: districtField.ru,
                        id: `${field.en.toUpperCase()}_${districtField.en.toUpperCase()}`,
                        cityId: field.en.toUpperCase(),
                    }),
                    overrideDefaultParams: true,
                });
            },
        }),
        upsertDictData({
            data: roomTypes,
            columnName: 'roomType',
            getAdditionalParams: field => ({
                ru: field.ru,
                fallbackName: field.ru,
                kz: field.kz,
                id: field.id,
            }),
            overrideDefaultParams: true,
        }),
        upsertDictData({
            data: sectionTypes,
            columnName: 'roomSectionType',
            getAdditionalParams: field => ({
                ru: field.ru,
                fallbackName: field.ru,
                kz: field.kz,
                id: field.id,
            }),
            overrideDefaultParams: true,
            additionalCallback: async field => {
                return upsertDictData({
                    data: field.roomTypes,
                    columnName: 'roomTypeAndSection',
                    getAdditionalParams: roomTypeField => ({
                        roomTypeId: roomTypeField,
                        sectionTypeId: field.id,
                        id: `${roomTypeField}_${field.id}`,
                    }),
                    overrideDefaultParams: true,
                });
            },
        }),
        upsertDictData({
            data: roomCharacteristics,
            columnName: 'characteristic',
            getAdditionalParams: field => ({
                ru: field.ru,
                fallbackName: field.ru,
                kz: field.kz,
                id: field.id,
                type: field.type,
            }),
            overrideDefaultParams: true,
            additionalCallback: async field => {
                return upsertDictData({
                    data: field.roomSectionTypes,
                    columnName: 'characteristicAndSection',
                    getAdditionalParams: sectionTypeField => ({
                        characteristicId: field.id,
                        sectionTypeId: sectionTypeField,
                        id: `${sectionTypeField}_${field.id}`,
                    }),
                    overrideDefaultParams: true,
                });
            },
        }),
        upsertDictData({
            data: roomAttributes,
            columnName: 'attribute',
            getAdditionalParams: field => ({
                ru: field.ru,
                fallbackName: field.ru,
                kz: field.kz,
                id: field.id,
            }),
            overrideDefaultParams: true,
            additionalCallback: async field => {
                return upsertDictData({
                    data: field.roomCharacteristics,
                    columnName: 'characteristicAndAttribute',
                    getAdditionalParams: roomCharacteristicField => ({
                        characteristicId: roomCharacteristicField,
                        attributeId: field.id,
                        id: `${roomCharacteristicField}_${field.id}`,
                    }),
                    overrideDefaultParams: true,
                });
            },
        }),
    ]);

    console.info('Data seeded successfully');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
