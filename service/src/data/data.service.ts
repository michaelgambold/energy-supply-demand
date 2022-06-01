import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { CreateDatumDto } from './dto/create-datum.dto';
import { DataFact } from '../entities/DataFact.entity';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(
    @InjectRepository(DataFact)
    private doorReposity: EntityRepository<DataFact>,
  ) {}

  async create(createDatumDto: CreateDatumDto) {
    this.doorReposity.create(createDatumDto);
    await this.doorReposity.flush();
  }

  // findAll() {
  //   return `This action returns all data`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} datum`;
  // }

  // update(id: number, updateDatumDto: UpdateDatumDto) {
  //   return `This action updates a #${id} datum`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} datum`;
  // }
}
