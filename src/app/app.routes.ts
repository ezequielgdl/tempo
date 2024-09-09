import { Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { NewComponent } from './clients/new/new.component';
import { TimerComponent } from './timer/timer.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth-guard.guard';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'clients/new', component: NewComponent, canActivate: [AuthGuard] },
  { path: 'timer', component: TimerComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];
