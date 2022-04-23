import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {PerfilComponent} from '../../user/perfil/perfil.component';
import {UserService} from '../../user/user.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Profile} from '../../interfaces/profile';
import {Style} from '../../interfaces/style';

@Component({
  selector: 'app-toolbar-main-menu',
  templateUrl: './toolbar-main-menu.component.html',
  styleUrls: ['./toolbar-main-menu.component.css'],
})
export class ToolbarMainMenuComponent implements OnInit {
  style: Style = {};
  perfil = true;
  profile: Profile;
  constructor(private messageService: MessageService, private dialogService: DialogService,
              private userService: UserService, private cookieService: CookieService, private router: Router, private translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.style.width = '80px';
    this.style.backgroundColor = '#bababa';
    this.profile = {};
  }

  ngOnInit(): void {
    this.userService.findUser(+this.cookieService.get('userId')).subscribe((data: any) => {
      this.profile.nome = data.name;
      this.profile.email = data.email;
      this.profile.genero = data.gender;
      this.profile.dataNasc = data.birthDate;
      this.profile.foto = '';
    });
  }

  changeLocale(locale: string){
    this.cookieService.delete('locale', '');
    this.cookieService.set('locale', locale, {path: ''});
    window.location.reload();
  }

  showProfile(){
    const ref = this.dialogService.open(PerfilComponent, {
      data: {
        nome: this.profile.nome,
        email: this.profile.email,
        genero: this.profile.genero,
        dataNasc: this.profile.dataNasc,
        foto: this.profile.foto
      },
      width: '500px',
    });
  }

  logOut(){
    this.router.navigate(['app/main/login']);
  }

}
