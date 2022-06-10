import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fuel } from '../models/fuel';

@Injectable({
  providedIn: 'root',
})
export class FuelService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Fuel[]> {
    return this.http.get<Fuel[]>('/api/v1/fuel');
  }
}
