import { AlojamientosService } from './alojamientos.service';
export declare class AlojamientosController {
    private svc;
    constructor(svc: AlojamientosService);
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
