import { Module } from '@nestjs/common';
import { AlojamientosController } from './alojamientos.controller';
import { AlojamientosService } from './alojamientos.service';
@Module({ controllers: [AlojamientosController], providers: [AlojamientosService] })
export class AlojamientosModule {}