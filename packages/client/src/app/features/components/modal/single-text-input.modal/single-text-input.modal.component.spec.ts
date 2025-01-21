import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSingleTextInputModalComponent } from './app-single-text-input.modal.component';

describe('AppSingleTextInputModalComponent', () => {
  let component: AppSingleTextInputModalComponent;
  let fixture: ComponentFixture<AppSingleTextInputModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSingleTextInputModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSingleTextInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
