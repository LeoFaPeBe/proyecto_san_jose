import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class ActividadesService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.actividad.findMany(); }
}