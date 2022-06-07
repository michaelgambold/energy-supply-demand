import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Fuel } from '../entities/Fuel.entity';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Fuel])],
  providers: [FuelService],
  exports: [FuelService],
  controllers: [FuelController],
})
export class FuelModule {}
