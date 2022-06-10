import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-live-data-page',
  templateUrl: './live-data-page.component.html',
  styleUrls: ['./live-data-page.component.css'],
})
export class LiveDataPageComponent implements OnInit {
  constructor(private readonly dashboardService: DataService) {}

  ngOnInit(): void {}
}
