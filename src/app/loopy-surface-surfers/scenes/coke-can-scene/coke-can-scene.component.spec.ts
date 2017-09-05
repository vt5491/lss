import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CokeCanSceneComponent } from './coke-can-scene.component';

describe('CokeCanSceneComponent', () => {
  let component: CokeCanSceneComponent;
  let fixture: ComponentFixture<CokeCanSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CokeCanSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CokeCanSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
