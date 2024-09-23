import { TestBed } from '@angular/core/testing';

import { InvoiceHelperService } from './invoice-helper.service';

describe('InvoiceHelperService', () => {
  let service: InvoiceHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
