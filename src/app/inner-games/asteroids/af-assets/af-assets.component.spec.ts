import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfAssetsComponent } from './af-assets.component';

describe('AfAssetsComponent', () => {
  let component: AfAssetsComponent;
  let fixture: ComponentFixture<AfAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
