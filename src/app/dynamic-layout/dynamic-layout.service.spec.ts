import { TestBed } from '@angular/core/testing';

import { DynamicLayoutService } from './dynamic-layout.service';

describe('DynamicLayoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicLayoutService = TestBed.get(DynamicLayoutService);
    expect(service).toBeTruthy();
  });
});
