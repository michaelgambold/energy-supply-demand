import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Fuel } from '../entities/Fuel.entity';

@Injectable()
export class FuelService {
  private readonly logger = new Logger(FuelService.name);

  constructor(
    @InjectRepository(Fuel)
    private fuelRepository: EntityRepository<Fuel>,
  ) {}

  findAll() {
    this.logger.log('Finding all fuel');
    return this.fuelRepository.findAll();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} datum`;
  // }
}
