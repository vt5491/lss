import { TestBed, inject } from '@angular/core/testing';

import { OuterSceneService } from './outer-scene.service';

describe('OuterGameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OuterSceneService]
    });
  });

  it('should ...', inject([OuterSceneService], (service: OuterSceneService) => {
    expect(service).toBeTruthy();
  }));
});
