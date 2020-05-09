import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * User service for login
 */
@Injectable()
export class UserService{
    private isAuth: boolean = false;
    private url: string = environment.urlAPI;

    constructor(private httpClient: HttpClient){}

    async login(username: string, password: string){
        return await this.httpClient
            .post(this.url + '/user/getByUsername', { username : username, password: password })
            .toPromise();
    }

    setIsAuth(isAuth: boolean){
        this.isAuth = isAuth;
    }

    getIsAuth(){
        return this.isAuth;
    }
}