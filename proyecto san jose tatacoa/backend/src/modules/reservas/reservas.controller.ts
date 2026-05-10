import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReservasService } from './reservas.service';

@ApiTags('reservas')
@ApiBearerAuth()
@Controller('reservas')
export class ReservasController {
  constructor(private svc: ReservasService) {}
  @Get() findAll(@Query('q') q?: string, @Query('estado') estado?: string) { return this.svc.findAll(q, estado); }
  @Get('stats') stats() { return this.svc.stats(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: any, @CurrentUser() u: any) { return this.svc.create(dto, u?.sub); }
  @Patch(':id/estado') updateEstado(@Param('id') id: string, @Body() body: { estado: string }) { return this.svc.updateEstado(id, body.estado); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}