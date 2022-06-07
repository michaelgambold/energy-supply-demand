import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveDataPageComponent } from './live-data-page.component';

describe('DashboardPageComponent', () => {
  let component: LiveDataPageComponent;
  let fixture: ComponentFixture<LiveDataPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveDataPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
