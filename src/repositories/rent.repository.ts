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
