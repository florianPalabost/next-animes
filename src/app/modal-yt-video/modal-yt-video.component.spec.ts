import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalYtVideoComponent } from './modal-yt-video.component';

describe('ModalYtVideoComponent', () => {
  let component: ModalYtVideoComponent;
  let fixture: ComponentFixture<ModalYtVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalYtVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalYtVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
