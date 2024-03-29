import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stats } from '../models/stats';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor(private readonly http: HttpClient) {}

  getStats(): Observable<Stats> {
    return this.http.get<Stats>('/api/v1/stats');
  }
}
