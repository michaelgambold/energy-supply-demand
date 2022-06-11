import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Data } from '../../shared/models/data';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-live-data-page',
  templateUrl: './live-data-page.component.html',
  styleUrls: ['./live-data-page.component.css'],
})
export class LiveDataPageComponent implements OnInit, OnDestroy {
  data$ = new Subject<Data>();

  private socket!: Socket;

  constructor(private readonly dataService: DataService) {}

  ngOnInit(): void {
    this.socket = io('/data');

    this.socket.on('connect', () => {
      console.log('connected to socket');
    });

    this.socket.on('error', (error) => {
      console.warn(error);
    });

    this.socket.on('new-data', (data: Data) => {
      this.data$.next(data);
    });
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
