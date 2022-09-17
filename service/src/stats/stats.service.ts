import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { DataFact } from '../entities/DataFact.entity';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  async getDatabaseSize(): Promise<string> {
    const query = await this.em
      .getKnex()
      .raw("select pg_size_pretty(pg_database_size('postgres')) as size");

    return query.rows[0].size;
  }

  async getMinTimestamp(): Promise<Date> {
    const query = await this.em
      .getKnex()
      .min('timestamp')
      .from('data_fact')
      .first();

    return query.min;
  }

  async getMaxTimestamp(): Promise<Date> {
    const query = await this.em
      .getKnex()
      .max('timestamp')
      .from('data_fact')
      .first();

    return query.max;
  }

  async getRecordCount(): Promise<number> {
    const dataFactRepository = this.orm.em.getRepository(DataFact);
    return dataFactRepository.count();
  }
}
