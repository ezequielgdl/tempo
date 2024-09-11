import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth-service.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

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
      take(1),
      map(user => {
        const isLoggedIn = !!user;
        if (isLoggedIn) {
          if (state.url === '/login') {
            this.router.navigate(['/clients']);
            return false;
          }
          return true;
        } else {
          if (state.url !== '/login') {
            this.router.navigate(['/login']);
            return false;
          }
          return true;
        }
      })
    );
  }
}