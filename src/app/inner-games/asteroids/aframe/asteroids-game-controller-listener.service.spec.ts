import { TestBed, inject } from '@angular/core/testing';

import { AsteroidsGameControllerListenerService } from './asteroids-game-controller-listener.service';

describe('AsteroidsGameControllerListenerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AsteroidsGameControllerListenerService]
    });
  });

  it('should ...', inject([AsteroidsGameControllerListenerService], (service: AsteroidsGameControllerListenerService) => {
    expect(service).toBeTruthy();
  }));
});
