import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
