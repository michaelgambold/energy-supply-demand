import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Job } from 'bull';
// import { SocketService } from './socket.service';
// import { CreateSocketDto } from './dto/create-socket.dto';
// import { UpdateSocketDto } from './dto/update-socket.dto';
import { Socket } from 'socket.io';
import { DataDto } from './dto/data.dto';

@WebSocketGateway({ namespace: 'data' })
@Processor('new-data')
export class DataGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(DataGateway.name);
  private readonly wsClients: Socket[] = [];

  // constructor(private readonly socketService: SocketService) {
  constructor() {
    // setInterval(() => {
    //   console.log('emitting hello to ' + this.wsClients.length + ' clients');
    //   this.wsClients.forEach((c) => {
    //     c.emit('hello', '🐈');
    //   });
    // }, 10000);
  }

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

  @Process()
  handleNewData(job: Job<DataDto>) {
    this.logger.log('Sending new data to websocket clients');
    for (const wsClient of this.wsClients) {
      wsClient.send('new-data', job.data);
    }
  }

  // KEEP: working example of pushing to socket from client and responding
  // @SubscribeMessage('liveData')
  // liveData(@ConnectedSocket() client: any) {
  //   // console.log(client);
  //   console.log('live data subcription 🐈');
  //   client.send('liveData2', 'hi back');
  //   return 'hi';
  // }
}
