import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Region } from '../entities/Region.entity';
import { RegionService } from './region.service';

@Module({
  imports: [MikroOrmModule.forFeature([Region])],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
