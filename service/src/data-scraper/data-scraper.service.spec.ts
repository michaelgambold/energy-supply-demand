import { Test, TestingModule } from '@nestjs/testing';
import { DataScraperService } from './data-scraper.service';

describe('DataScraperService', () => {
  let service: DataScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataScraperService],
    }).compile();

    service = module.get<DataScraperService>(DataScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
