import { PrismaService } from '../../prisma/prisma.service';
export declare class ActividadesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        nombre: string;
        icon: string;
        precio: number;
        descripcion: string;
        duracion: string;
    }[]>;
}
