import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../project.service';
import {UserService} from '../../user/user.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../../interfaces/user';
import {Membro} from '../../interfaces/membro';
import {NewMembro} from '../../interfaces/new.membro';
import {Papel} from '../../interfaces/papel';
import {Style} from '../../interfaces/style';

@Component({
  selector: 'app-adicionar-membros',
  templateUrl: './adicionar-membros.component.html',
  styleUrls: ['./adicionar-membros.component.css']
})
export class AdicionarMembrosComponent implements OnInit {
  selectedUser: User;
  newMembro: NewMembro;
  papeis: Papel[];
  papelSelecionado: Papel;
  idProjeto: number;
  membros: Membro[];
  email: string;
  style: Style = {width: ''};
  errorMessage: string;
  name: string;
  locale: string;

  constructor(private projectService: ProjectService, private userService: UserService, private router: Router, private cookieService: CookieService, private translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.style.width = '250px';
    this.selectedUser = {};
    this.newMembro = {};
  }

  ngOnInit(): void {
    this.idProjeto = +this.cookieService.get('idProjeto');
    this.name = this.cookieService.get('projectName');
    this.atualizarMembros();
    this.locale = this.cookieService.get('locale') || 'pt';
    if (this.locale === 'en'){
      this.papeis = [
        {name: 'Client', value: 'ROLE_CUSTOMER_REPRESENTATIVE'},
        {name: 'Requirement Analyst', value: 'ROLE_REQUIREMENT_ANALYST'},
        {name: 'Business Analyst', value: 'ROLE_BUSINESS_ANALYST'},
        {name: 'Test Analyst', value: 'ROLE_TEST_ANALYST'},
        {name: 'Programmer', value: 'ROLE_PROGRAMMER'}
      ];
    }
    else {
      this.papeis = [
        {name: 'Cliente', value: 'ROLE_CUSTOMER_REPRESENTATIVE'},
        {name: 'Analista de Requisitos', value: 'ROLE_REQUIREMENT_ANALYST'},
        {name: 'Analista de Negócios', value: 'ROLE_BUSINESS_ANALYST'},
        {name: 'Analista de Testes', value: 'ROLE_TEST_ANALYST'},
        {name: 'Programador', value: 'ROLE_PROGRAMMER'}
      ];
    }
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

  encontrarUsuario(){
    this.errorMessage = '';
    this.selectedUser = {};
    const item1 = this.membros.find(i => i.email === this.email);
    if (item1) {
      this.errorMessage = 'É membro';
      return;
    }
    this.userService.findByEmail(this.email).subscribe(
      (response) => {
          this.setSelectedUser(response);
      },
      (error) => {
        this.errorMessage = 'Usuário não encontrado';
        throw error;
      }
    );
  }

  voltar(){
    this.router.navigate(['app/projeto/membros']);
  }

  setSelectedUser(user: any){
    this.selectedUser = user;
  }
  adicionar(){
    this.projectService.addMember(this.idProjeto, this.selectedUser.id, this.papelSelecionado.value).subscribe((response) => {
        this.atualizarMembros();
      },
      (error) => {
        throw error;
      });
  }
}
