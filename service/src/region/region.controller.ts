import { Controller, Get } from '@nestjs/common';
import { RegionDimension } from '../entities/RegionDimension.entity';
import { RegionService } from './region.service';

@Controller('api/v1/region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  findAll(): Promise<RegionDimension[]> {
    return this.regionService.findAll();
  }
}
