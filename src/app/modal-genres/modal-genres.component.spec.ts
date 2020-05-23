import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGenresComponent } from './modal-genres.component';

describe('ModalGenresComponent', () => {
  let component: ModalGenresComponent;
  let fixture: ComponentFixture<ModalGenresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGenresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGenresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
