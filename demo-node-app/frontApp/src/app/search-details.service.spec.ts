import { TestBed } from '@angular/core/testing';

import { SearchDetailsService } from './search-details.service';

describe('SearchDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchDetailsService = TestBed.get(SearchDetailsService);
    expect(service).toBeTruthy();
  });
});
