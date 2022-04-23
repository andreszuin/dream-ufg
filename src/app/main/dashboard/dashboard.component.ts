import { Component, OnInit } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {CadastroProjetoComponent} from '../../project/cadastro-projeto/cadastro-projeto.component';
import {Router} from '@angular/router';
import {UserService} from '../../user/user.service';
import {formatDate} from '@angular/common';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {Project} from '../../interfaces/project';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userId: number;
  projetos: Project[];
  locale: string;
  constructor(private dialogService: DialogService, private router: Router, private userService: UserService, private cookieService: CookieService, private translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.locale = this.cookieService.get('locale') || 'pt';
    this.projetos = [];
    this.getProjects();
  }

  ngOnInit(): void {
  }

  getProjects(){
    this.userService.getProjects(+this.cookieService.get('userId')).subscribe(
      (response) => {
        this.projetos = response;
        this.format();
      },
      (error) => {
        throw error;
      });
  }

  format(){
    for (const projeto of this.projetos){
      if (projeto.visibility === true){
        if (this.locale === 'pt'){
          projeto.visibility = 'Publico';
        }
        else{
          projeto.visibility = 'Public';
        }
      }
      else{
        if (this.locale === 'pt'){
          projeto.visibility = 'Privado';
        }
        else{
          projeto.visibility = 'Private';
        }
      }
      projeto.completionForecast = formatDate(projeto.completionForecast, 'dd/MM/yyyy', 'en');
    }
    this.projetos = this.projetos.sort((obj1, obj2) => {
      if (obj1.name > obj2.name) {
        return 1;
      }

      if (obj1.name < obj2.name) {
        return -1;
      }

      return 0;
    });
  }

  cadastrarProjeto(){
    const ref = this.dialogService.open(CadastroProjetoComponent, {
      width: '30vw'
    });
    ref.onClose.subscribe(result => {
      this.getProjects();
    });
  }

  acessarProjeto(projectName: string){
    this.cookieService.delete('projectName', '');
    this.cookieService.set('projectName', projectName, {path: ''});
    this.router.navigate(['app/projeto/informacoes']);
  }
}
