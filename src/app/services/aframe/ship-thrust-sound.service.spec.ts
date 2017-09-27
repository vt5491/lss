import { TestBed, inject } from '@angular/core/testing';

import { ShipThrustSoundService } from './ship-thrust-sound.service';
import { UtilsService } from '../../services/utils.service';
import { BaseService } from '../../services/base.service';

fdescribe('ShipThrustSoundService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShipThrustSoundService, UtilsService, BaseService]
    });
  });

  it('should ...', inject([ShipThrustSoundService, UtilsService, BaseService],
     (service: ShipThrustSoundService, utils: UtilsService, base: BaseService) => {
    expect(service).toBeTruthy();
  }));
});
