import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { RentStatus } from '../models/enums/rent-status.enum';

@Injectable()
export default class RentRepository {
    constructor(private prisma: PrismaService) {}

    public async checkExistingRent(roomId: string, userId: string) {
        return this.prisma.rent.findFirst({
            where: {
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
            include: {
                ...this.roomPropsForRent.include,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        secondName: true,
                    },
                },
            },
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
                        name: RentStatus.PENDING,
                    },
                },
            },
        });
    }
}
