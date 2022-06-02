// import {
//   SubscribeMessage,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { SocketService } from './socket.service';
// import { CreateSocketDto } from './dto/create-socket.dto';
// import { UpdateSocketDto } from './dto/update-socket.dto';
// import { Socket } from 'socket.io';

// export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   private readonly wsClients: Socket[] = [];

//   constructor(private readonly socketService: SocketService) {
//     setInterval(() => {
//       console.log('emitting hello to ' + this.wsClients.length + ' clients');

//       this.wsClients.forEach((c) => {
//         c.emit('hello', 'hello client');
//       });
//     }, 10000);
//   }

//   handleDisconnect(client: any) {
//     for (let i = 0; i < this.wsClients.length; i++) {
//       if (this.wsClients[i] === client) {
//         this.wsClients.splice(i, 1);
//         break;
//       }
//     }
//   }
//   handleConnection(client: Socket, ...args: any[]) {
//     // console.log(client);
//     this.wsClients.push(client);
//   }

//   @SubscribeMessage('liveData')
//   liveData(@ConnectedSocket() client: any) {
//     // console.log(client);
//     console.log('live data subcription');
//     client.send('liveData2', 'hi back');
//     return 'hi';
//   }

//   @SubscribeMessage('createSocket')
//   create(@MessageBody() createSocketDto: CreateSocketDto) {
//     return this.socketService.create(createSocketDto);
//   }

//   @SubscribeMessage('findAllSocket')
//   findAll() {
//     return this.socketService.findAll();
//   }

//   @SubscribeMessage('findOneSocket')
//   findOne(@MessageBody() id: number) {
//     return this.socketService.findOne(id);
//   }

//   @SubscribeMessage('updateSocket')
//   update(@MessageBody() updateSocketDto: UpdateSocketDto) {
//     return this.socketService.update(updateSocketDto.id, updateSocketDto);
//   }

//   @SubscribeMessage('removeSocket')
//   remove(@MessageBody() id: number) {
//     return this.socketService.remove(id);
//   }
// }
