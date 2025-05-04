import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { RentStatus } from '../models/enums/rent-status.enum';
import { WithTransactionPrisma } from '../types/transaction-prisma.types';

@Injectable()
export default class RentRepository {
    constructor(private prisma: PrismaService) {}

    public async checkExistingRent(roomId: string, userId: string) {
        return this.prisma.rent.findFirst({
            where: {
                rentStatus: {
                    not: RentStatus.CLOSED,
                },
                roomId,
                userId,
            },
        });
    }

    private roomPropsForRent = {
        include: {
            room: {
                select: {
                    price: true,
                    priceUnit: true,
                    hasDeposit: true,
                    status: true,
                    title: true,
                },
            },
            user: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    secondName: true,
                },
            },
        },
    };

    public async getRentsByRoomId(roomId: string, status: RentStatus, take: number, skip: number) {
        return this.prisma.rent.findMany({
            where: {
                roomId,
                rentStatus: {
                    in: status ? [status] : Object.values(RentStatus),
                },
            },
            take,
            skip,
            ...this.roomPropsForRent,
        });
    }

    public async getRentsByUserId(userId: string, status: RentStatus, take: number, skip: number) {
        return this.prisma.rent.findMany({
            where: {
                userId,
                rentStatus: {
                    in: status ? [status] : Object.values(RentStatus),
                },
            },
            take,
            skip,
            ...this.roomPropsForRent,
        });
    }

    public async createRent({
        dueDate,
        issuedDate,
        userId,
        roomId,
        totalPrice,
    }: {
        dueDate: string;
        issuedDate: string;
        userId: string;
        roomId: string;
        totalPrice: number;
    }) {
        return this.prisma.rent.create({
            data: {
                totalPrice,
                dueDate,
                issuedDate,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                room: {
                    connect: {
                        id: roomId,
                    },
                },
                rStatus: {
                    connect: {
                        name: RentStatus.OPENED,
                    },
                },
            },
        });
    }

    public async getRentByIdWithoutControversialIssues(rentId: string) {
        return this.prisma.rent.findUnique({
            where: {
                id: rentId,
                controversialIssues: {
                    none: {},
                },
            },
        });
    }

    public async getRentById(rentId: string) {
        return this.prisma.rent.findUnique({
            where: {
                id: rentId,
            },
            include: {
                controversialIssues: true,
                room: {
                    include: {
                        userRelation: {
                            select: {
                                email: true,
                            },
                        },
                        roomType: {
                            select: {
                                ru: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        });
    }

    public async changeRentStatus({
        transactionPrisma,
        rentId,
        status,
        paymentDate,
    }: WithTransactionPrisma<{ rentId: string; status: RentStatus; paymentDate?: string }>) {
        const prismaInstance = transactionPrisma ?? this.prisma;
        return prismaInstance.rent.update({
            where: { id: rentId },
            data: {
                rentStatus: status,
                ...(paymentDate ? { paymentDate } : {}),
            },
        });
    }
}
