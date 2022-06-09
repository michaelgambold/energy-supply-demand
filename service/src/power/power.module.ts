import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Power } from '../entities/Power.entity';
import { PowerService } from './power.service';
import { PowerController } from './power.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Power])],
  providers: [PowerService],
  exports: [PowerService],
  controllers: [PowerController],
})
export class PowerModule {}
