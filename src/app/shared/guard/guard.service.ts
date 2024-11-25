import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { CanActivate, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.userIsAuthenticated().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']); // Redirigir al login si no está autenticado
        }
      })
    );
  }
}

