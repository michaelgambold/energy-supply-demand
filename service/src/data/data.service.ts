import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { DataFact } from '../entities/DataFact.entity';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(
    @InjectRepository(DataFact)
    private dataFactRepository: EntityRepository<DataFact>,
  ) {}

  async findDataRange(args: {
    startDate: Date;
    endDate: Date;
    fuelId?: number;
    powerId?: number;
    regionId?: number;
  }) {
    this.logger.log('Find data range');

    const qb = this.dataFactRepository
      .qb()
      .select('uuid')
      .where({ timestamp: { $gte: args.startDate } })
      .andWhere({ timestamp: { $lte: args.endDate } });

    if (args.fuelId) {
      qb.andWhere({ fuel: args.fuelId });
    }

    if (args.powerId) {
      qb.andWhere({ power: args.powerId });
    }

    if (args.regionId) {
      qb.andWhere({ region: args.regionId });
    }

    const uuids = (await qb.execute()).map((x) => x.uuid);

    return this.dataFactRepository.find(
      {
        uuid: { $in: uuids },
      },
      {
        populate: ['fuel', 'region', 'power'],
        orderBy: { timestamp: 'asc' },
      },
    );
  }
}
