import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.services'
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private cookieService: CookieService,
              private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
    if(this.cookieService.check('token')){
      this.router.navigate(['/addWord']);
    }
  }

  connectionForm(){
      this.userService.login(this.loginForm.value['username'], this.loginForm.value['password'])
          .then((res) =>{
            const token = res['token'];
            this.cookieService.set('token', token);
            this.router.navigate(['/addWord']);
          })
          .catch((err) => {

          });
  }
}
