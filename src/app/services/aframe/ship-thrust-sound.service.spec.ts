import { TestBed, inject } from '@angular/core/testing';

import { ShipThrustSoundService } from './ship-thrust-sound.service';

describe('ShipThrustSoundService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShipThrustSoundService]
    });
  });

  it('should ...', inject([ShipThrustSoundService], (service: ShipThrustSoundService) => {
    expect(service).toBeTruthy();
  }));
});
