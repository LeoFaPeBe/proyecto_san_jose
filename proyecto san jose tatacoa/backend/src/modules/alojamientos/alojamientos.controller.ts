import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AlojamientosService } from './alojamientos.service';
@ApiTags('alojamientos')
@Controller('alojamientos')
export class AlojamientosController {
  constructor(private svc: AlojamientosService) {}
  @Public() @Get() findAll() { return this.svc.findAll(); }
}