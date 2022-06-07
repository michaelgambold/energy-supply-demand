import { Controller, Get } from '@nestjs/common';
import { Region } from '../entities/Region.entity';
import { RegionService } from './region.service';

@Controller('api/v1/region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  findAll(): Promise<Region[]> {
    return this.regionService.findAll();
  }
}
