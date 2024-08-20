import { Injectable, } from '@angular/core';
import { UrlTree, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, delay, map, of, switchMap, tap } from 'rxjs';
import { NavService } from './../../shared/services/nav.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = localStorage.getItem('token'); // or use your preferred method to get the token

    if (this.isTokenValid(token)) {
      return true;
    } else {
      const redirectUrl = state.url;
      this.router.navigate(['/auth/login'], { queryParams: { redirectUrl } });
      return false;
    }

    // if(!localStorage.getItem('token')) {
    
    //   return false
    //   this.router.navigate(['/auth/login']);
    //   return false;
    // }
    //this.navService.sidebarLoading = true;

    // // this.store.dispatch(new GetBadges());
    // // this.store.dispatch(new GetNotification());
    // // this.store.dispatch(new GetUserDetails()).subscribe({
    //   // complete: () => {
    //     this.navService.sidebarLoading = false;
    //   }
    // });
    
    // return true
  }
  private isTokenValid(token: string | null): boolean {
    // Implement your token validation logic here
    return !!token;
  }
  canActivateChild(): Observable<boolean> {
    
        if (localStorage.getItem('token')) {
          // Delay the navigation by 1 second
          return of(true).pipe(
            delay(1000),
            tap(() => this.router.navigate(['/dashboard']))
          );
        }

        // User is not authenticated, allow access to child route
        return of(true);
    
  }

}
