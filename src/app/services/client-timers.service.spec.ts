import { TestBed } from '@angular/core/testing';

import { ClientTimersService } from './client-timers.service';

describe('ClientTimersService', () => {
  let service: ClientTimersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientTimersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
