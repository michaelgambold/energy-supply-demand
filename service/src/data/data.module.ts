import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DataFact } from '../entities/DataFact.entity';
import { DataGateway } from './data.gateway';
import { FuelModule } from '../fuel/fuel.module';
import { RegionModule } from '../region/region.module';
import { PowerModule } from '../power/power.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([DataFact]),
    FuelModule,
    RegionModule,
    PowerModule,
  ],
  controllers: [DataController],
  providers: [DataService, DataGateway],
})
export class DataModule {}
