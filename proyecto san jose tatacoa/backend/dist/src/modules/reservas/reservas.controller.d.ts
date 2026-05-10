import { ReservasService } from './reservas.service';
export declare class ReservasController {
    private svc;
    constructor(svc: ReservasService);
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
    stats(): Promise<{
        total: number;
        confirmadas: number;
        pendientes: number;
        canceladas: number;
    }>;
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
    create(dto: any, u: any): Promise<{
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
    updateEstado(id: string, body: {
        estado: string;
    }): Promise<{
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
}
