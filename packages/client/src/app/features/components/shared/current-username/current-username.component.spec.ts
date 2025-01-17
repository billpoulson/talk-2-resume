import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentUsernameComponent } from './current-username.component';

describe('CurrentUsernameComponent', () => {
  let component: CurrentUsernameComponent;
  let fixture: ComponentFixture<CurrentUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentUsernameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
