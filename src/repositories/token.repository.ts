import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma.service';

@Injectable()
export class TokenRepository {
    constructor(private prisma: PrismaService) {}

    public async createToken(token: string, userId: string) {
        return this.prisma.token.create({ data: { value: token, userId } });
    }

    public async updateRefreshToken(refreshToken: string, newRefreshToken: string) {
        await this.prisma.token.update({ where: { value: refreshToken }, data: { value: newRefreshToken } });
    }

    public async getUserTokens(userId: string) {
        return this.prisma.token.findMany({ where: { userId } });
    }

    public async deleteUserTokensById(tokenIds: string[]) {
        return this.prisma.token.deleteMany({ where: { id: { in: tokenIds } } });
    }

    public async deletesUserTokenByValue(value: string) {
        return this.prisma.token.delete({ where: { value } });
    }
}
