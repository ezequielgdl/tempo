import { Routes } from '@angular/router';
import { ClientsComponent } from './components/clients/clients.component';
import { NewComponent } from './components/clients/new/new.component';
import { TimerComponent } from './components/timer/timer.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth-guard.guard';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { EditComponent } from './components/clients/edit/edit.component';
import { InvoicesComponent } from './components/invoices/invoices.component'; 
import { NewInvoiceComponent } from './components/invoices/new/new.component';
import { EditInvoiceComponent } from './components/invoices/edit/edit.component';
import { InvoiceComponent } from './components/invoices/invoice/invoice.component';
import { UserComponent } from './components/user/user.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'clients/new', component: NewComponent, canActivate: [AuthGuard] },
  { path: 'timer', component: TimerComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'clients/:id/edit', component: EditComponent, canActivate: [AuthGuard] },
  { path: 'invoices', component: InvoicesComponent, canActivate: [AuthGuard] },
  { path: 'invoices/:id/new', component: NewInvoiceComponent, canActivate: [AuthGuard] },
  { path: 'invoices/:id/edit', component: EditInvoiceComponent, canActivate: [AuthGuard] },
  { path: 'invoices/:id', component: InvoiceComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
];
