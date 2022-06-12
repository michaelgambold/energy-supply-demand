import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Data } from '../../shared/models/data';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-live-data-page',
  templateUrl: './live-data-page.component.html',
  styleUrls: ['./live-data-page.component.css'],
})
export class LiveDataPageComponent implements OnInit, OnDestroy, OnDestroy {
  data$ = new Subject<Data>();
  lastUpdatedAt?: Date;

  private socket!: Socket;
  private dataSub!: Subscription;

  constructor(private readonly dataService: DataService) {}

  ngOnInit(): void {
    this.dataSub = this.data$.subscribe(() => {
      this.lastUpdatedAt = new Date();
    });

    this.socket = io('/data');

    this.socket.on('connect', () => {
      console.log('connected to /data socket');
    });

    this.socket.on('error', (error) => {
      console.warn(error);
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected from /data socket');
    });

    // subscribe to new data event from backend
    this.socket.on('new-data', (data: Data) => {
      this.data$.next(data);
    });

    // get latest data immediately instead of waiting for the next new data tick
    this.socket.emit('get-latest-data', (data: Data) => {
      console.log(JSON.stringify(data));
      this.data$.next(data);
    });
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
    this.dataSub.unsubscribe();
  }
}
