import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUserNameDialogComponent } from './set-user-name-dialog.component';

describe('SetUserNameDialogComponent', () => {
  let component: SetUserNameDialogComponent;
  let fixture: ComponentFixture<SetUserNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetUserNameDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetUserNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
