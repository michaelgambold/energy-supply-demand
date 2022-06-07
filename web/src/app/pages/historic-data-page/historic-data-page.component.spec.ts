import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricDataPageComponent } from './historic-data-page.component';

describe('HistoricDataPageComponent', () => {
  let component: HistoricDataPageComponent;
  let fixture: ComponentFixture<HistoricDataPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricDataPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
