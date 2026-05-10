import { ActividadesService } from './actividades.service';
export declare class ActividadesController {
    private svc;
    constructor(svc: ActividadesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        nombre: string;
        icon: string;
        precio: number;
        descripcion: string;
        duracion: string;
    }[]>;
}
