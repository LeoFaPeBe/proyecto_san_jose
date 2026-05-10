import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: string;
        };
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: string;
    }>;
}
