import { Controller, Get } from '@nestjs/common';
import { Fuel } from '../entities/Fuel.entity';
import { FuelService } from './fuel.service';

@Controller('api/v1/fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Get()
  findAll(): Promise<Fuel[]> {
    return this.fuelService.findAll();
  }
}
