import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ActividadesService } from './actividades.service';
@ApiTags('actividades')
@Controller('actividades')
export class ActividadesController {
  constructor(private svc: ActividadesService) {}
  @Public() @Get() findAll() { return this.svc.findAll(); }
}