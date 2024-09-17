import { TestBed } from '@angular/core/testing';
import { ClientService } from './client.service';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth-service.service';
import { of } from 'rxjs';
import { Client } from '../interfaces';
import { User } from '@supabase/supabase-js';

describe('ClientService', () => {
  let clientService: ClientService;
  let supabaseServiceMock: jasmine.SpyObj<SupabaseService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let mockSupabaseClient: any;

  const mockClients: Client[] = [
    { id: '1', user_id: 'user1', name: 'Client 1', email: 'client1@example.com', address: '123 Main St', pricePerHour: 100 },
    { id: '2', user_id: 'user1', name: 'Client 2', email: 'client2@example.com', address: '456 Elm St', pricePerHour: 120 },
  ];

  beforeEach(() => {
    mockSupabaseClient = {
      from: jasmine.createSpy('from').and.returnValue({
        select: jasmine.createSpy('select').and.returnValue({
          eq: jasmine.createSpy('eq').and.returnValue({
            single: jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: mockClients[0], error: null })),
          }),
        }),
        insert: jasmine.createSpy('insert').and.returnValue({
          select: jasmine.createSpy('select').and.returnValue({
            single: jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: mockClients[0], error: null })),
          }),
        }),
        update: jasmine.createSpy('update').and.returnValue({
          eq: jasmine.createSpy('eq').and.returnValue({
            select: jasmine.createSpy('select').and.returnValue({
              single: jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: mockClients[0], error: null })),
            }),
          }),
        }),
        delete: jasmine.createSpy('delete').and.returnValue({
          eq: jasmine.createSpy('eq').and.returnValue({
            eq: jasmine.createSpy('eq').and.returnValue(Promise.resolve({ error: null })),
          }),
        }),
      }),
      auth: {
        getUser: jasmine.createSpy('getUser').and.returnValue(Promise.resolve({ data: { user: { id: 'user1' } }, error: null })),
      },
    };

    supabaseServiceMock = jasmine.createSpyObj('SupabaseService', ['getClient']);
    supabaseServiceMock.getClient.and.returnValue(mockSupabaseClient);

    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authServiceMock.getCurrentUser.and.returnValue(of({
      id: 'user1',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as User));

    TestBed.configureTestingModule({
      providers: [
        ClientService,
        { provide: SupabaseService, useValue: supabaseServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    clientService = TestBed.inject(ClientService);
  });

  it('should be created', () => {
    expect(clientService).toBeTruthy();
  });

  it('should fetch clients', (done) => {
    mockSupabaseClient.from().select().eq = jasmine.createSpy().and.returnValue(Promise.resolve({ data: mockClients, error: null }));

    clientService.getClients().subscribe({
      next: (clients) => {
        expect(clients).toEqual(mockClients);
        done();
      },
      error: (error) => {
        fail(`Should not have errored: ${JSON.stringify(error)}`);
        done();
      }
    });
  });

  it('should get a single client by id', (done) => {
    clientService.getClient('1').subscribe({
      next: (client) => {
        expect(client).toEqual(mockClients[0]);
        done();
      },
      error: (error) => {
        fail(`Should not have errored: ${JSON.stringify(error)}`);
        done();
      }
    });
  });

  it('should create a new client', (done) => {
    const newClient = { 
      name: 'New Client', 
      email: 'new@example.com',
      address: '789 Oak St',
      pricePerHour: 150
    };
    clientService.createClient(newClient).subscribe({
      next: (client) => {
        expect(client).toEqual(mockClients[0]);
        done();
      },
      error: (error) => {
        fail(`Should not have errored: ${JSON.stringify(error)}`);
        done();
      }
    });
  });

  it('should update a client', (done) => {
    const updatedClient = { name: 'Updated Client' };
    clientService.updateClient('1', updatedClient).subscribe({
      next: (client) => {
        expect(client).toEqual(mockClients[0]);
        done();
      },
      error: (error) => {
        fail(`Should not have errored: ${JSON.stringify(error)}`);
        done();
      }
    });
  });

  it('should delete a client', (done) => {
    clientService.deleteClient('1').subscribe({
      next: () => {
        expect(mockSupabaseClient.from().delete().eq().eq).toHaveBeenCalled();
        done();
      },
      error: (error) => {
        fail(`Should not have errored: ${JSON.stringify(error)}`);
        done();
      }
    });
  });

  it('should handle errors when fetching clients', (done) => {
    mockSupabaseClient.from().select().eq = jasmine.createSpy().and.returnValue(Promise.resolve({ data: null, error: new Error('Fetch error') }));

    clientService.getClients().subscribe({
      next: () => {
        fail('should have failed with the error');
        done();
      },
      error: (error) => {
        expect(error.message).toBe('Fetch error');
        done();
      }
    });
  });
});
