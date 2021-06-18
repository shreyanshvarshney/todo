import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from 'src/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const returnUrl = state.url;
    return this.authService.authStateListener()
    .pipe(
      map((authState) => {
        if(!authState?.loggedIn) {
          this.router.navigate(['/login'], {queryParams: {returnUrl: returnUrl}});
          return false
        }
        return true;
      })
    )
  }
  
}
