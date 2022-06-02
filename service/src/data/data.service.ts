import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { CreateDatumDto } from './dto/create-datum.dto';
import { DataFact } from '../entities/DataFact.entity';
import { distinct } from 'rxjs';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(
    @InjectRepository(DataFact)
    private dataFactRepository: EntityRepository<DataFact>,
  ) {}

  async findLatestData(limit: number) {
    // get latest timstamps
    const qb = this.dataFactRepository
      .createQueryBuilder()
      .select('timestamp', true)
      .orderBy({ timestamp: 'desc' })
      .limit(limit);

    const timestamps = (await qb.execute()).map((x) => x.timestamp);

    return this.dataFactRepository.find({ timestamp: timestamps });
  }

  // async create(createDatumDto: CreateDatumDto) {
  //   this.dataFactRepository.create(createDatumDto);
  //   await this.dataFactRepository.flush();
  // }

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
