import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleModalComponent } from './example.modal.component';

describe('ExampleModalComponent', () => {
  let component: ExampleModalComponent;
  let fixture: ComponentFixture<ExampleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
