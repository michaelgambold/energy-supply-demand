import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { Region } from '../models/region';

@Injectable({
  providedIn: 'root',
})
export class RegionService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Region[]> {
    return this.http.get<Region[]>('/api/v1/region').pipe(delay(1000));
  }
}
