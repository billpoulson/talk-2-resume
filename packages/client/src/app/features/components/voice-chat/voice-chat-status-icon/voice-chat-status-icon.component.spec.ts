import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VoiceChatStatusComponent } from './voice-chat-status-icon.component'

describe('VoiceChatStatusComponent', () => {
  let component: VoiceChatStatusComponent;
  let fixture: ComponentFixture<VoiceChatStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoiceChatStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceChatStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
