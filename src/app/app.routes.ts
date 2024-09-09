import { Routes } from '@angular/router';
import { ClientsComponent } from './components/clients/clients.component';
import { NewComponent } from './components/clients/new/new.component';
import { TimerComponent } from './components/timer/timer.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth-guard.guard';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'clients/new', component: NewComponent, canActivate: [AuthGuard] },
  { path: 'timer', component: TimerComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];
