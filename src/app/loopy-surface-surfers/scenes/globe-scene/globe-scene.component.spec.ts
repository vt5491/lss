import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobeSceneComponent } from './globe-scene.component';

describe('GlobeSceneComponent', () => {
  let component: GlobeSceneComponent;
  let fixture: ComponentFixture<GlobeSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobeSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobeSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
