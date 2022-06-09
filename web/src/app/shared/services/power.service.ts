import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Power } from '../models/power';

@Injectable({
  providedIn: 'root',
})
export class PowerService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Power[]> {
    return this.http.get<Power[]>('/api/v1/power');
  }
}
