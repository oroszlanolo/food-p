import { TestBed } from '@angular/core/testing';

import { FoodPropertyService } from './food-property.service';
import { provideHttpClient } from '@angular/common/http';

describe('FoodPropertyService', () => {
  let service: FoodPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],});
    service = TestBed.inject(FoodPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
