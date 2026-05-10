import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

function nextCodigo(list: any[]): string {
  const max = list.reduce((m, r) => {
    const n = parseInt(r.codigo.replace('R-', ''), 10);
    return n > m ? n : m;
  }, 0);
  return `R-${String(max + 1).padStart(3, '0')}`;
}

@Injectable()
export class ReservasService {
  constructor(private prisma: PrismaService) {}

  async findAll(q?: string, estado?: string) {
    const all = await this.prisma.reserva.findMany({
      orderBy: { creadoEn: 'desc' },
      where: {
        ...(estado ? { estado } : {}),
        ...(q ? { OR: [{ huesped: { contains: q } }, { alojamiento: { contains: q } }, { email: { contains: q } }] } : {}),
      },
    });
    return all.map(r => ({ ...r, actividades: JSON.parse(r.actividades || '[]') }));
  }

  async findOne(id: string) {
    const r = await this.prisma.reserva.findUnique({ where: { id } });
    if (!r) throw new NotFoundException();
    return { ...r, actividades: JSON.parse(r.actividades || '[]') };
  }

  async create(dto: any, userId?: string) {
    const all = await this.prisma.reserva.findMany({ select: { codigo: true } });
    const codigo = nextCodigo(all);
    const nights = Math.ceil((new Date(dto.salida).getTime() - new Date(dto.llegada).getTime()) / 86400000);
    const r = await this.prisma.reserva.create({
      data: {
        codigo,
        huesped: dto.huesped,
        email: dto.email,
        telefono: dto.telefono ?? '',
        alojamiento: dto.alojamiento,
        llegada: new Date(dto.llegada),
        salida: new Date(dto.salida),
        personas: dto.personas ?? 1,
        actividades: JSON.stringify(dto.actividades ?? []),
        notas: dto.notas ?? '',
        estado: 'Pendiente',
        total: `$${(dto.precioPorNoche * nights).toLocaleString('es-CO')}`,
        creadoPor: userId ?? null,
      },
    });
    return { ...r, actividades: JSON.parse(r.actividades) };
  }

  async updateEstado(id: string, estado: string) {
    const r = await this.prisma.reserva.update({ where: { id }, data: { estado } });
    return { ...r, actividades: JSON.parse(r.actividades || '[]') };
  }

  async remove(id: string) {
    await this.prisma.reserva.delete({ where: { id } });
    return { ok: true };
  }

  async stats() {
    const all = await this.prisma.reserva.findMany({ select: { estado: true } });
    return {
      total: all.length,
      confirmadas: all.filter(r => r.estado === 'Confirmada').length,
      pendientes: all.filter(r => r.estado === 'Pendiente').length,
      canceladas: all.filter(r => r.estado === 'Cancelada').length,
    };
  }
}