import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class AlojamientosService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.alojamiento.findMany(); }
}