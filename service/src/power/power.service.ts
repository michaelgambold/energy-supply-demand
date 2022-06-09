import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Power } from '../entities/Power.entity';

@Injectable()
export class PowerService {
  private readonly logger = new Logger(PowerService.name);

  constructor(
    @InjectRepository(Power)
    private powerRepository: EntityRepository<Power>,
  ) {}

  findAll() {
    return this.powerRepository.findAll();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} datum`;
  // }
}
