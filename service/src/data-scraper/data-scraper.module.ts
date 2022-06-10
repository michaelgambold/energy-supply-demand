import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { DataScraperService } from './data-scraper.service';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'new-data',
    }),
  ],
  providers: [DataScraperService],
})
export class DataScraperModule {}
