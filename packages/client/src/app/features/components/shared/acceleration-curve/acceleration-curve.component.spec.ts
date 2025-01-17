import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccelerationCurveComponent } from './acceleration-curve.component';

describe('AccelerationCurveComponent', () => {
  let component: AccelerationCurveComponent;
  let fixture: ComponentFixture<AccelerationCurveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccelerationCurveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccelerationCurveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
