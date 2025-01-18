import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProgressBarComponent } from './upload-progress-bar.component';

describe('UploadProgressBarComponent', () => {
  let component: UploadProgressBarComponent;
  let fixture: ComponentFixture<UploadProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
