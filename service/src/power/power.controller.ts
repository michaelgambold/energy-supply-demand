import { Controller, Get } from '@nestjs/common';
import { PowerDimension } from '../entities/PowerDimension.entity';
import { PowerService } from './power.service';

@Controller('api/v1/power')
export class PowerController {
  constructor(private readonly powerService: PowerService) {}

  @Get()
  findAll(): Promise<PowerDimension[]> {
    return this.powerService.findAll();
  }
}
