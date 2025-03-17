import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

export type TransactionPrisma = Omit<PrismaClient, runtime.ITXClientDenyList>;

export type WithTransactionPrisma<T extends Record<string, any>> = T & { transactionPrisma?: TransactionPrisma };
