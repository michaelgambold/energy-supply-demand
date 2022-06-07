import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Region } from '../entities/Region.entity';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Region])],
  providers: [RegionService],
  exports: [RegionService],
  controllers: [RegionController],
})
export class RegionModule {}
