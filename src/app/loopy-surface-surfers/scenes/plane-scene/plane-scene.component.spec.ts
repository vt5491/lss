import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaneSceneComponent } from './plane-scene.component';

xdescribe('PlaneSceneComponent', () => {
  let component: PlaneSceneComponent;
  let fixture: ComponentFixture<PlaneSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaneSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaneSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
