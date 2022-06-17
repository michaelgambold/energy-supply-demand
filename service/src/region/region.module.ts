import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RegionDimension } from '../entities/RegionDimension.entity';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';

@Module({
  imports: [MikroOrmModule.forFeature([RegionDimension])],
  providers: [RegionService],
  exports: [RegionService],
  controllers: [RegionController],
})
export class RegionModule {}
