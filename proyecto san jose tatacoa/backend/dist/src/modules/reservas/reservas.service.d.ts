import { PrismaService } from '../../prisma/prisma.service';
export declare class ReservasService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(q?: string, estado?: string): Promise<{
        actividades: any;
        id: string;
        email: string;
        alojamiento: string;
        codigo: string;
        huesped: string;
        telefono: string;
        llegada: Date;
        salida: Date;
        personas: number;
        notas: string;
        estado: string;
        total: string;
        creadoEn: Date;
        creadoPor: string | null;
    }[]>;
    findOne(id: string): Promise<{
        actividades: any;
        id: string;
        email: string;
        alojamiento: string;
        codigo: string;
        huesped: string;
        telefono: string;
        llegada: Date;
        salida: Date;
        personas: number;
        notas: string;
        estado: string;
        total: string;
        creadoEn: Date;
        creadoPor: string | null;
    }>;
    create(dto: any, userId?: string): Promise<{
        actividades: any;
        id: string;
        email: string;
        alojamiento: string;
        codigo: string;
        huesped: string;
        telefono: string;
        llegada: Date;
        salida: Date;
        personas: number;
        notas: string;
        estado: string;
        total: string;
        creadoEn: Date;
        creadoPor: string | null;
    }>;
    updateEstado(id: string, estado: string): Promise<{
        actividades: any;
        id: string;
        email: string;
        alojamiento: string;
        codigo: string;
        huesped: string;
        telefono: string;
        llegada: Date;
        salida: Date;
        personas: number;
        notas: string;
        estado: string;
        total: string;
        creadoEn: Date;
        creadoPor: string | null;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
    stats(): Promise<{
        total: number;
        confirmadas: number;
        pendientes: number;
        canceladas: number;
    }>;
}
