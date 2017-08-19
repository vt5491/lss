import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolHallSceneComponent } from './pool-hall-scene.component';

describe('PoolHallSceneComponent', () => {
  let component: PoolHallSceneComponent;
  let fixture: ComponentFixture<PoolHallSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoolHallSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolHallSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
