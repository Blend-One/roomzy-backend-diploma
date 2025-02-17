import { PrismaClient } from '@prisma/client';
import { roles } from './seed_data/roles';

const prisma = new PrismaClient();

async function main() {
    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role, id: role },
            update: {},
            create: { name: role, id: role },
        });
    }

    console.info('Roles seeded successfully');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
