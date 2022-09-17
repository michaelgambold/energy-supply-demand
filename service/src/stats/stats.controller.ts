import { Controller, Get, Logger } from '@nestjs/common';
import { StatsDto } from './dto/stats.dto';
import { StatsService } from './stats.service';

@Controller('api/v1/stats')
export class StatsController {
  private readonly logger = new Logger(StatsController.name);

  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats(): Promise<StatsDto> {
    const minTimestamp = await this.statsService.getMinTimestamp();
    const maxTimestamp = await this.statsService.getMaxTimestamp();
    const recordCount = await this.statsService.getRecordCount();
    const databaseSizeMb = await this.statsService.getDatabaseSizeMb();

    return {
      databaseSizeMb,
      maxTimestamp: maxTimestamp.toISOString(),
      minTimestamp: minTimestamp.toISOString(),
      recordCount,
    };
  }
}
