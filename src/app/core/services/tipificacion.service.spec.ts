import { TestBed } from '@angular/core/testing';

import { TipificacionService } from './tipificacion.service';

describe('TipificacionService', () => {
  let service: TipificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
