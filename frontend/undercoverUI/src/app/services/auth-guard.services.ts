import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.services';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService,
              private router: Router,
              private cookieService: CookieService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(this.checkJwt(this.cookieService.get('token'))){
      return true;
    }else {
      this.router.navigate(['/authentification']);
    }
  }

  checkJwt(token): boolean{
    const currentTime = Date.now() / 1000;
    if(token == '' || token == undefined || token == null){
      return false;
    }else{
      const jwtDecoded = jwt_decode(token);
      if(jwtDecoded.exp < currentTime){
        return false;
      }else{
        this.cookieService.set('username', jwtDecoded['username']);
        return true;
      }
    }
  }

}