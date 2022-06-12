import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Job } from 'bull';
import { Socket } from 'socket.io';
import { DataFact } from '../entities/DataFact.entity';
import { DataService } from './data.service';
import { DataDto } from './dto/data.dto';

@WebSocketGateway({ namespace: 'data' })
@Processor('new-data')
export class DataGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(DataGateway.name);
  private readonly wsClients: Socket[] = [];

  constructor(private readonly orm: MikroORM) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.wsClients.push(client);
    this.logger.log(`Client with id ${client.id} connected`);
    this.logger.log(`There are now ${this.wsClients.length} clients connected`);
  }

  handleDisconnect(client: Socket) {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1);
        break;
      }
    }

    this.logger.log(`Client with id ${client.id} disconnected`);
    this.logger.log(`There are now ${this.wsClients.length} clients connected`);
  }

  // process bull queue event to send new data to clients
  @Process()
  handleNewData(job: Job<DataDto>) {
    this.logger.log('Sending new data to websocket clients');
    for (const wsClient of this.wsClients) {
      wsClient.emit('new-data', job.data);
    }
  }

  @SubscribeMessage('get-latest-data')
  @UseRequestContext()
  async liveData(@ConnectedSocket() client: Socket): Promise<DataDto> {
    this.logger.log('Getting/sending latest data to websocket clients');

    const dataFactRepository = this.orm.em.getRepository(DataFact);

    // get latest timestamp
    const maxTimestamp = await dataFactRepository.findAll({
      orderBy: { timestamp: 'desc' },
      limit: 1,
    });

    const dataFacts = await dataFactRepository.find(
      {
        timestamp: { $eq: maxTimestamp[0].timestamp },
      },
      {
        populate: ['fuel', 'region', 'power'],
      },
    );

    return dataFacts.reduce(
      (dto: DataDto, dataFact) => {
        if (!dto.metadata.fuels.includes(dataFact.fuel)) {
          dto.metadata.fuels.push(dataFact.fuel);
        }
        if (!dto.metadata.power.includes(dataFact.power)) {
          dto.metadata.power.push(dataFact.power);
        }
        if (!dto.metadata.regions.includes(dataFact.region)) {
          dto.metadata.regions.push(dataFact.region);
        }

        dto.data.push({
          fuelId: dataFact.fuel.id,
          powerId: dataFact.power.id,
          regionId: dataFact.region.id,
          timestamp: dataFact.timestamp,
          value: dataFact.value,
        });

        return dto;
      },
      {
        metadata: {
          fuels: [],
          power: [],
          regions: [],
        },
        data: [],
      },
    );
  }
}
