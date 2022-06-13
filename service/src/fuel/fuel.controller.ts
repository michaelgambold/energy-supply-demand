import { Controller, Get } from '@nestjs/common';
import { FuelDimension } from '../entities/FuelDimension.entity';
import { FuelService } from './fuel.service';

@Controller('api/v1/fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Get()
  findAll(): Promise<FuelDimension[]> {
    return this.fuelService.findAll();
  }
}
