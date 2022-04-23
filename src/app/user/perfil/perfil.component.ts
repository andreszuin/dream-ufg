import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {UserService} from '../user.service';
import {HttpParams} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {Genero} from '../../interfaces/genero';
import {Style} from '../../interfaces/style';
import {User} from '../../interfaces/user';

const MatchingPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const psswd = control.get('password');
  const psswdConf = control.get('psswdConf');
  return psswd && psswdConf && psswd.value !== psswdConf.value ?
    { passwordnotmatching: true } : null;
};

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [UserService]
})
export class PerfilComponent implements OnInit {
  nome: string;
  email: string;
  genero: string;
  dataNasc: Date;
  foto: string;
  userForm: FormGroup;
  passForm: FormGroup;
  style: Style = {};
  generos: Genero[];
  personDto: User;
  locale: string;

  constructor(public config: DynamicDialogConfig, private userService: UserService, private cookieService: CookieService, private translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.personDto = {};
    this.style.width = '250px';
  }
  ngOnInit(): void {
    this.nome = this.config.data.nome;
    this.email = this.config.data.email;
    this.genero = this.config.data.genero;
    this.dataNasc = this.config.data.dataNasc;
    // this.foto = this.config.data.foto;
    this.foto = 'teste.png';
    this.userForm = new FormGroup({
      name: new FormControl(this.nome, [Validators.required]),
      gender: new FormControl({value: this.genero}, [Validators.required]),
      birthDate: new FormControl(new Date(this.dataNasc + 'EDT'), [Validators.required]),
    });
    this.passForm = new FormGroup({
      oldPass: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      psswdConf: new FormControl('', [Validators.required]),
    }, {validators: Validators.compose([MatchingPasswordValidator])});
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
  }

  get name() {return this.userForm.get('name'); }

  get gender() {return this.userForm.get('gender'); }

  get birthDate() {return this.userForm.get('birthDate'); }

  get oldPassword() {return this.passForm.get('oldPass'); }

  get password() {return this.passForm.get('password'); }

  get psswdConf() {return this.passForm.get('psswdConf'); }

  change(id: string){
    const x = document.getElementById(id);
    if (x.style.display === 'none'){
      x.style.display = 'flex';
    }
    else{
      x.style.display = 'none';
    }
  }

  atualizar() {
    this.change('perfil');
    this.change('atualizar');
  }
  confirmarAtualizar(){
    this.personDtoConstructor();
    const params = new HttpParams().set('name', this.name.value)
      .set('gender', this.gender.value.label)
      .set('birthDate', this.birthDate.value);
    this.userService.updateUser(params, +this.cookieService.get('userId')).subscribe(
      (response) => {
        this.change('perfil');
        this.change('atualizar');
      },
      (error) => {
        throw error;
      });
  }
  personDtoConstructor(){
    this.personDto = Object.assign(this.personDto, this.userForm.value);
    this.personDto.gender = this.gender.value.value;
  }

  modificar() {
    this.change('perfil');
    this.change('modificar');
  }
  confirmarModificar(){
    const changePassword = {oldPassword: this.oldPassword.value, newPassword: this.password.value};
    this.userService.changePassword(changePassword, +this.cookieService.get('userId')).subscribe(
      (response) => {
        this.change('perfil');
        this.change('modificar');
      },
      (error) => {
        throw error;
      });
  }

  onFileInput($event){
    console.log($event.target.files[0]);
  }

}
