import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartFakeRequestButtonComponent } from './start-fake-request-button.component';

describe('StartFakeRequestButtonComponent', () => {
  let component: StartFakeRequestButtonComponent;
  let fixture: ComponentFixture<StartFakeRequestButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartFakeRequestButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartFakeRequestButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
