import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelListModalComponent } from './channel-list.modal.component';

describe('ChannelListModalComponent', () => {
  let component: ChannelListModalComponent;
  let fixture: ComponentFixture<ChannelListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelListModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
