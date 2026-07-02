import { TestBed } from '@angular/core/testing';

import { ReceitaServices } from './receita-services';

describe('ReceitaServices', () => {
  let service: ReceitaServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceitaServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
