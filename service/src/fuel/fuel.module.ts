import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Fuel } from '../entities/Fuel.entity';
import { FuelService } from './fuel.service';

@Module({
  imports: [MikroOrmModule.forFeature([Fuel])],
  providers: [FuelService],
  exports: [FuelService],
})
export class FuelModule {}
