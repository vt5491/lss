import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxorSceneComponent } from './luxor-scene.component';

describe('LuxorSceneComponent', () => {
  let component: LuxorSceneComponent;
  let fixture: ComponentFixture<LuxorSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuxorSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuxorSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
