import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { RegionDimension } from '../entities/RegionDimension.entity';

@Injectable()
export class RegionService {
  private readonly logger = new Logger(RegionDimension.name);

  constructor(
    @InjectRepository(RegionDimension)
    private regionRepository: EntityRepository<RegionDimension>,
  ) {}

  findAll() {
    this.logger.log('Finding all regions');
    return this.regionRepository.findAll();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} datum`;
  // }
}
