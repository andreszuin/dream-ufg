import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private router: Router, private login: LoginService, private cookieService: CookieService, private translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  get username() {return this.loginForm.get('username'); }

  get password() {return this.loginForm.get('password'); }

  fazerLogin(){
    this.login.login(this.username.value, this.password.value).subscribe((response) => {
        this.encontrarId();
        this.router.navigate(['/app/dashboard']);
      },
      (error) => {
        throw error;
      });
  }

  encontrarId(){
    this.login.getId(this.username.value).subscribe((response) => {
        this.cookieService.delete('userId', '');
        this.cookieService.set('userId', response.id.toString(), {path: ''});
      },
      (error) => {
        throw error;
      });
  }

  showResponse(response){
    console.log(response);
  }

}
