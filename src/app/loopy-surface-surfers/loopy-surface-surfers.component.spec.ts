import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoopySurfaceSurfersComponent } from './loopy-surface-surfers.component';

describe('LoopySurfaceSurfersComponent', () => {
  let component: LoopySurfaceSurfersComponent;
  let fixture: ComponentFixture<LoopySurfaceSurfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoopySurfaceSurfersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopySurfaceSurfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
