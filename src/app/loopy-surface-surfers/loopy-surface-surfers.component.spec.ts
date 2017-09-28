import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterTestingModule } from '@angular/router/testing';

import { LoopySurfaceSurfersComponent } from './loopy-surface-surfers.component';
import { AsteroidsGame } from '../inner-games/asteroids/asteroids-game';
import { Ship } from '../inner-games/asteroids/ship';
import { BaseService } from '../services/base.service';
import { UtilsService } from '../services/utils.service';

fdescribe('LoopySurfaceSurfersComponent', () => {
  let component: LoopySurfaceSurfersComponent;
  let fixture: ComponentFixture<LoopySurfaceSurfersComponent>;

  // TestBed.configureTestingModule({
  //     imports: [RouterTestingModule, NgbModule.forRoot(), DummyService],
  //   declarations: [ MyNewComponentComponent ]
  // })
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // imports: [AsteroidsGame],
      declarations: [ LoopySurfaceSurfersComponent ],
      imports: [RouterTestingModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [AsteroidsGame, Ship, UtilsService, BaseService,
        THREE.Scene
        // {
        //   provide: THREE.Scene,
        //   useClass: MockDummyService
        //         }
      ]
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
