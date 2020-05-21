import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimesDetailComponent } from './animes-detail.component';

describe('AnimesDetailComponent', () => {
  let component: AnimesDetailComponent;
  let fixture: ComponentFixture<AnimesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
