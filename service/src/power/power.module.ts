import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PowerDimension } from '../entities/PowerDimension.entity';
import { PowerService } from './power.service';
import { PowerController } from './power.controller';

@Module({
  imports: [MikroOrmModule.forFeature([PowerDimension])],
  providers: [PowerService],
  exports: [PowerService],
  controllers: [PowerController],
})
export class PowerModule {}
