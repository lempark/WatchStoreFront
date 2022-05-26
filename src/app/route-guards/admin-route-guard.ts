import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminRouteGuard implements CanActivate {

  constructor(private router: Router, private authSerice: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    var canActivate = false;
    canActivate = this.authSerice.isAdmin();
    if(!canActivate)
    {
        this.router.navigate(['/404'], { skipLocationChange: true });
    }
    return canActivate
  }
}