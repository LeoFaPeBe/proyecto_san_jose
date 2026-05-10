"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
function nextCodigo(list) {
    const max = list.reduce((m, r) => {
        const n = parseInt(r.codigo.replace('R-', ''), 10);
        return n > m ? n : m;
    }, 0);
    return `R-${String(max + 1).padStart(3, '0')}`;
}
let ReservasService = class ReservasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(q, estado) {
        const all = await this.prisma.reserva.findMany({
            orderBy: { creadoEn: 'desc' },
            where: {
                ...(estado ? { estado } : {}),
                ...(q ? { OR: [{ huesped: { contains: q } }, { alojamiento: { contains: q } }, { email: { contains: q } }] } : {}),
            },
        });
        return all.map(r => ({ ...r, actividades: JSON.parse(r.actividades || '[]') }));
    }
    async findOne(id) {
        const r = await this.prisma.reserva.findUnique({ where: { id } });
        if (!r)
            throw new common_1.NotFoundException();
        return { ...r, actividades: JSON.parse(r.actividades || '[]') };
    }
    async create(dto, userId) {
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
    async updateEstado(id, estado) {
        const r = await this.prisma.reserva.update({ where: { id }, data: { estado } });
        return { ...r, actividades: JSON.parse(r.actividades || '[]') };
    }
    async remove(id) {
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
};
exports.ReservasService = ReservasService;
exports.ReservasService = ReservasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReservasService);
//# sourceMappingURL=reservas.service.js.map