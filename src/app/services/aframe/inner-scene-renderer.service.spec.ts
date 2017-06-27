import { TestBed, inject } from '@angular/core/testing';

import { InnerSceneRendererService } from './inner-scene-renderer.service';

describe('InnerSceneRendererService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InnerSceneRendererService]
    });
  });

  it('should ...', inject([InnerSceneRendererService], (service: InnerSceneRendererService) => {
    expect(service).toBeTruthy();
  }));
});
