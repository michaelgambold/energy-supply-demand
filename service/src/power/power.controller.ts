import { Controller, Get } from '@nestjs/common';
import { Power } from '../entities/Power.entity';
import { PowerService } from './power.service';

@Controller('api/v1/power')
export class PowerController {
  constructor(private readonly powerService: PowerService) {}

  @Get()
  findAll(): Promise<Power[]> {
    return this.powerService.findAll();
  }
}
