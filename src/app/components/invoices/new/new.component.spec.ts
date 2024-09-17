import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NewInvoiceComponent } from './new.component';
import { TimerService } from '../../../services/timer.service';
import { ClientTimersService } from '../../../services/client-timers.service';

describe('NewInvoiceComponent', () => {
  let component: NewInvoiceComponent;
  let fixture: ComponentFixture<NewInvoiceComponent>;
  let mockTimerService: jasmine.SpyObj<TimerService>;
  let mockClientTimersService: jasmine.SpyObj<ClientTimersService>;

  beforeEach(async () => {
    mockTimerService = jasmine.createSpyObj('TimerService', ['getClientUninvoicedTimersByDate', 'getAllUninvoicedTimers']);
    mockClientTimersService = jasmine.createSpyObj('ClientTimersService', ['setClientTimers']);

    await TestBed.configureTestingModule({
      imports: [NewInvoiceComponent, ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' })
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        },
        { provide: TimerService, useValue: mockTimerService },
        { provide: ClientTimersService, useValue: mockClientTimersService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests as needed
});
