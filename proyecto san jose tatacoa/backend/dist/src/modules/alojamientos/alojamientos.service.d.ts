import { PrismaService } from '../../prisma/prisma.service';
export declare class AlojamientosService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        nombre: string;
        icon: string;
        capacidad: string;
        precio: number;
        descripcion: string;
        disponible: boolean;
    }[]>;
}
