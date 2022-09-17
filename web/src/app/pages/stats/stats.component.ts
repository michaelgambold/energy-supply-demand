import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Stats } from '../../shared/models/stats';
import { StatsService } from '../../shared/services/stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
  stats$!: Observable<Stats>;

  constructor(private readonly statsService: StatsService) {}

  ngOnInit(): void {
    this.stats$ = this.statsService.getStats();
  }
}
