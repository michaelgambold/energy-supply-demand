import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Region } from '../entities/Region.entity';

@Injectable()
export class RegionService {
  private readonly logger = new Logger(Region.name);

  constructor(
    @InjectRepository(Region)
    private regionRepository: EntityRepository<Region>,
  ) {}

  findAll() {
    this.logger.log('Finding all regions');
    return this.regionRepository.findAll();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} datum`;
  // }
}
