import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProjectService} from '../project.service';
import {ConfirmationService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {GerenciarPapeisComponent} from '../gerenciar-papeis/gerenciar-papeis.component';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {Membro} from '../../interfaces/membro';
import {Gestor} from '../../interfaces/gestor';

@Component({
  selector: 'app-membros',
  templateUrl: './membros.component.html',
  styleUrls: ['./membros.component.css'],
  providers: [ConfirmationService]
})
export class MembrosComponent implements OnInit {
  idProjeto: number;
  gestor: Gestor;
  membros: Membro[];
  name: string;
  removeMessage: string;
  removeHeader: string;
  constructor(private router: Router, private projectService: ProjectService,
              private confirmationService: ConfirmationService, private dialogService: DialogService, private cookieService: CookieService, private translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.gestor = {photo: 'teste.png', email: 'teste', name: 'teste'};
    translate.get('Membros.Remove').subscribe((res: string) => {
      this.removeMessage = res;
    });
    translate.get('Membros.RemoveHeader').subscribe((res: string) => {
      this.removeHeader = res;
    });
  }

  ngOnInit(): void {
    this.idProjeto = +this.cookieService.get('idProjeto');
    this.name = this.cookieService.get('projectName');
    this.atualizarMembros();
  }

  atualizarMembros(){
    this.projectService.getMembers(this.idProjeto).subscribe(
        (response) => {
          this.membros = response;
        },
        (error) => {
          throw error;
        });
  }

  remover(idMembro: number){
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.projectService.removeMember(this.idProjeto, idMembro).subscribe(
            (response) => {
              this.atualizarMembros();
            },
            (error) => {
              throw error;
            });
      },
      reject: () => {
      }
    });
  }



  adicionar(){
    this.router.navigate(['app/projeto/adicionar-membros']);
  }

  voltar(){
    this.router.navigate(['app/projeto/informacoes']);
  }

  papeis(membro: number, name: string){
    this.cookieService.delete('nameMembro', '');
    this.cookieService.set('nameMembro', name, {path: ''});
    this.cookieService.delete('idMembro', '');
    this.cookieService.set('idMembro', membro.toString(), {path: ''});
    console.log(membro);
    const ref = this.dialogService.open(GerenciarPapeisComponent, {
      width: '300px'
    });
  }
}
