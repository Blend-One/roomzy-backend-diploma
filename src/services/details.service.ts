import { Injectable } from '@nestjs/common';
import { Locale } from '../models/enums/locale.enum';
import { TransactionPrisma } from '../types/transaction-prisma.types';

@Injectable()
export class DetailsService {
    public getNameFilter(locale: Locale, name: string) {
        return {
            [locale]: {
                contains: name,
            },
        };
    }

    public obtainParamsForGetQuery(relation: string, field: string, locale: Locale) {
        return {
            [relation]: {
                select: {
                    [field]: {
                        select: {
                            id: true,
                            [locale]: true,
                        },
                    },
                },
            },
        };
    }

    public obtainParamsForCreationQuery(
        ids: string[],
        creationRelation: string,
        creationField: string,
        additionalParams: Record<string, any> = {},
    ) {
        return {
            ...additionalParams,
            [creationRelation]: {
                create: Array.from(new Set(ids)).map(id => ({
                    [creationField]: {
                        connect: {
                            id,
                        },
                    },
                })),
            },
        };
    }

    public obtainParamsForDeleteRelations(
        prisma: TransactionPrisma,
        tableName: string,
        fieldForCondition: string,
        id: string,
    ) {
        return {
            tableName,
            transactionPrisma: prisma,
            condition: {
                [fieldForCondition]: id,
            },
        };
    }

    public obtainParamsForUpdate({
        prisma,
        id,
        tableName,
        body,
        idsForRelation,
        relationField,
        fieldWithinRelation,
    }: {
        prisma: TransactionPrisma;
        id: string;
        tableName: string;
        body: Record<string, any>;
        idsForRelation: string[];
        relationField: string;
        fieldWithinRelation: string;
    }) {
        return {
            body,
            id,
            tableName,
            transactionPrisma: prisma,
            updatedRelations: idsForRelation?.length
                ? {
                      [relationField]: {
                          create: idsForRelation.map(id => ({
                              [fieldWithinRelation]: {
                                  connect: {
                                      id,
                                  },
                              },
                          })),
                      },
                  }
                : {},
        };
    }
}
