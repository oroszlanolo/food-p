import { TestBed } from '@angular/core/testing';

import { FoodPropertyService } from './food-property.service';

describe('FoodPropertyService', () => {
  let service: FoodPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
