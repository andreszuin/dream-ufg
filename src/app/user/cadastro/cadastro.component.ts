import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {UserService} from '../user.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import {Style} from '../../interfaces/style';
import {User} from '../../interfaces/user';
import {Genero} from '../../interfaces/genero';

const MatchingEmailsValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const email = control.get('email');
  const emailConf = control.get('emailConf');
  return email && emailConf && email.value !== emailConf.value ?
    { emailnotmatching: true } : null;
};

const MatchingPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const psswd = control.get('password');
  const psswdConf = control.get('psswdConf');
  return psswd && psswdConf && psswd.value !== psswdConf.value ?
    { passwordnotmatching: true } : null;
};



@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  providers: [UserService]
})

export class CadastroComponent implements OnInit{
  userForm: FormGroup;
  personDto: User;
  generos: Genero[];
  style: Style = {};
  errorMessage: string;
  recaptcha: string;
  recaptchaDone: boolean;
  locale: string;
  summary: string;
  detail: string;

  constructor(private router: Router, private userService: UserService, private messageService: MessageService, private translate: TranslateService, private cookieService: CookieService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.style.width = '250px';
    this.personDto = {};
  }
  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      emailConf: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      psswdConf: new FormControl('', [Validators.required])
    }, {validators: Validators.compose([MatchingEmailsValidator, MatchingPasswordValidator])});
    this.locale = this.cookieService.get('locale') || 'pt';
    if (this.locale === 'en'){
      this.generos = [
        {label: 'Male', value: 'Masculino'},
        {label: 'Female', value: 'Feminino'},
        {label: 'Other', value: 'Outro'}
      ];
    }
    else {
      this.generos = [
        {label: 'Masculino', value: 'Masculino'},
        {label: 'Feminino', value: 'Feminino'},
        {label: 'Outro', value: 'Outro'}
      ];
    }
    this.recaptchaDone = false;
    this.translate.get('Cadastro.Summary').subscribe((res: string) => {
      this.summary = res;
    });
    this.translate.get('Cadastro.Detail').subscribe((res: string) => {
      this.detail = res;
    });
  }
  get name() {return this.userForm.get('name'); }

  get gender() {return this.userForm.get('gender'); }

  get birthDate() {return this.userForm.get('birthDate'); }

  get email() {return this.userForm.get('email'); }

  get emailConf() {return this.userForm.get('emailConf'); }

  get password() {return this.userForm.get('password'); }

  get psswdConf() {return this.userForm.get('psswdConf'); }

  personDtoConstructor(){
    this.personDto = Object.assign(this.personDto, this.userForm.value);
    this.personDto.gender = this.gender.value.value;
  }

  send(){
    this.personDtoConstructor();
    this.userService.addUser(this.personDto, this.recaptcha).subscribe(
      (response) => {
        this.messageService.add({severity: 'success', summary: this.summary, key: 'mainToast', detail: this.detail});
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = error;
        throw error;
      });
  }

  setResponse(response){
    this.recaptcha = response.response;
    this.recaptchaDone = true;
  }
}
