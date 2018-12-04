import { TestBed, inject } from '@angular/core/testing';

import { AsteroidsGameControllerListenerService } from './asteroids-game-controller-listener.service';
import { AsteroidsGame } from '../asteroids-game';
import { Ship} from '../ship';
import { BaseService } from '../../../services/base.service';
import { UtilsService } from '../../../services/utils.service';
import { ThreeJsSceneProvider } from '../../../services/utils.service';

describe('AsteroidsGameControllerListenerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AsteroidsGameControllerListenerService,
        AsteroidsGame,
        Ship,
        BaseService,
        UtilsService,
        ThreeJsSceneProvider,
      ]
    });
  });

  it('should ...', inject([AsteroidsGameControllerListenerService], (service: AsteroidsGameControllerListenerService) => {
  // it('should ...', inject([], (service: AsteroidsGameControllerListenerService) => {
    expect(service).toBeTruthy();
  }));
});
