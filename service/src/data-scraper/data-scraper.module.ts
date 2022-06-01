import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { FuelModule } from '../fuel/fuel.module';
import { RegionModule } from '../region/region.module';
import { DataScraperService } from './data-scraper.service';

@Module({
  imports: [HttpModule, DataModule, FuelModule, RegionModule],
  providers: [DataScraperService],
})
export class DataScraperModule {}
