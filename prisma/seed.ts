import { PrismaClient } from '@prisma/client';
import { Role } from '../src/models/enums/role.enum';

const prisma = new PrismaClient();

async function main() {
    const roles = Object.values(Role);

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role, id: role },
            update: {},
            create: { name: role },
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
