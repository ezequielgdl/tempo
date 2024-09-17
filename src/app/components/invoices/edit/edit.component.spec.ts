import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { EditInvoiceComponent } from './edit.component';
import { ClientService } from '../../../services/client.service';
import { ClientTimersService } from '../../../services/client-timers.service';
import { InvoicesService } from '../../../services/invoices.service';

describe('EditInvoiceComponent', () => {
  let component: EditInvoiceComponent;
  let fixture: ComponentFixture<EditInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInvoiceComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
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
        {
          provide: ClientService,
          useValue: {
            getClient: jasmine.createSpy('getClient').and.returnValue(of({
              id: '123',
              name: 'Test Client',
              pricePerHour: 50
            }))
          }
        },
        {
          provide: ClientTimersService,
          useValue: {
            getClientTimers: jasmine.createSpy('getClientTimers').and.returnValue([])
          }
        },
        {
          provide: InvoicesService,
          useValue: {
            setCurrentInvoice: jasmine.createSpy('setCurrentInvoice')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
