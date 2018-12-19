import { TestBed } from '@angular/core/testing';

import { DetailedInformationService } from './detailed-information.service';

describe('DetailedInformationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetailedInformationService = TestBed.get(DetailedInformationService);
    expect(service).toBeTruthy();
  });
});
