import { Component } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'web';

  private socket: Socket;

  constructor() {
    this.socket = io('/data');

    this.socket.on('connect', () => {
      console.log('connected to socket');
    });

    this.socket.on('error', (error) => {
      console.warn(error);
    });

    this.socket.on('hello', (data) => {
      console.log(data);
    });

    // setInterval(() => {
    //   this.socket.emit('liveData', 'whatts up');
    // }, 1000);
  }
}
