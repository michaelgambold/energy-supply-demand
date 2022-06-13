import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { FuelDimension } from '../entities/FuelDimension.entity';

@Injectable()
export class FuelService {
  private readonly logger = new Logger(FuelService.name);

  constructor(
    @InjectRepository(FuelDimension)
    private fuelRepository: EntityRepository<FuelDimension>,
  ) {}

  findAll() {
    return this.fuelRepository.findAll();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} datum`;
  // }
}
