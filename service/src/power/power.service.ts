import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { PowerDimension } from '../entities/PowerDimension.entity';

@Injectable()
export class PowerService {
  private readonly logger = new Logger(PowerService.name);

  constructor(
    @InjectRepository(PowerDimension)
    private powerRepository: EntityRepository<PowerDimension>,
  ) {}

  findAll() {
    return this.powerRepository.findAll();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} datum`;
  // }
}
