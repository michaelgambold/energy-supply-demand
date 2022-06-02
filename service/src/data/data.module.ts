import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DataFact } from '../entities/DataFact.entity';

@Module({
  imports: [MikroOrmModule.forFeature([DataFact])],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
