import { Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { NewComponent } from './clients/new/new.component';

export const routes: Routes = [
  { path: 'clients', component: ClientsComponent },
  { path: 'clients/new', component: NewComponent }
];
