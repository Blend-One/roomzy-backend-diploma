import { PrismaClient } from '@prisma/client';
import { roles } from './seed_data/roles.mjs';
import { rentStatuses } from './seed_data/rent-statuses.mjs';
import { priceUnits } from './seed_data/price-units.mjs';
import { roomStatuses } from './seed_data/room-statuses.mjs';

const prisma = new PrismaClient();

const getQueryParams = (field, shouldUpsertId) => {
    const params = {
        name: field,
    };

    if (shouldUpsertId) {
        params.id = field;
    }

    return params;
};

async function upsertDictData({ data, shouldUpsertId, columnName }) {
    for (const field of data) {
        const queryParams = getQueryParams(field, shouldUpsertId);
        await prisma[columnName].upsert({
            where: queryParams,
            update: {},
            create: queryParams,
        });
    }
}

async function main() {
    await Promise.all([
        upsertDictData({ data: roles, shouldUpsertId: true, columnName: 'role' }),
        upsertDictData({ data: rentStatuses, columnName: 'rentStatus' }),
        upsertDictData({ data: priceUnits, columnName: 'priceUnit' }),
        upsertDictData({ data: roomStatuses, columnName: 'roomStatus' }),
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
