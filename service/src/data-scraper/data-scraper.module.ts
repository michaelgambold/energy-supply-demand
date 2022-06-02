import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DataScraperService } from './data-scraper.service';

@Module({
  imports: [HttpModule],
  providers: [DataScraperService],
})
export class DataScraperModule {}
