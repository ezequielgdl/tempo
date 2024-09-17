import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth-service.service';
import { Observable, of } from 'rxjs';
import { switchMap, take, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      filter(user => user !== undefined), // Wait until we have a defined state
      take(1),
      switchMap(user => {
        const isLoggedIn = !!user;
        if (!isLoggedIn) {
          if (state.url === '/signup') {
            return of(true); // Allow access to signup for non-logged-in users
          }
          if (state.url !== '/login') {
            this.router.navigate(['/login']);
            return of(false);
          }
        } else if (state.url === '/login' || state.url === '/signup') {
          this.router.navigate(['/clients']);
          return of(false);
        }
        return of(true);
      })
    );
  }
}