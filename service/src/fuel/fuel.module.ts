import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FuelDimension } from '../entities/FuelDimension.entity';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';

@Module({
  imports: [MikroOrmModule.forFeature([FuelDimension])],
  providers: [FuelService],
  exports: [FuelService],
  controllers: [FuelController],
})
export class FuelModule {}
