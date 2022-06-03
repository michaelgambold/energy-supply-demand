import { Component, OnInit } from '@angular/core';
import { Data } from '../../models/data';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-historic-data-page',
  templateUrl: './historic-data-page.component.html',
  styleUrls: ['./historic-data-page.component.css'],
})
export class HistoricDataPageComponent implements OnInit {
  data?: Data;

  constructor(private readonly dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getLatestData().subscribe((data) => {
      this.data = data;
    });
  }
}
