import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../project.service';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {Papel} from '../../interfaces/papel';

@Component({
  selector: 'app-gerenciar-papeis',
  templateUrl: './gerenciar-papeis.component.html',
  styleUrls: ['./gerenciar-papeis.component.css']
})
export class GerenciarPapeisComponent implements OnInit {
  selectedMembroId: number;
  selectedMembroName: string;
  papeis: Papel[];
  papelSelecionado: Papel = {};
  idProjeto: number;
  locale: string;
  param: {};
  summary: string;
  detail: string;
  constructor(private projectService: ProjectService, private messageService: MessageService,
              public config: DynamicDialogConfig, private cookieService: CookieService, private translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
  }

  ngOnInit(): void {
    this.idProjeto = +this.cookieService.get('idProjeto');
    this.selectedMembroId = +this.cookieService.get('idMembro');
    this.selectedMembroName = this.cookieService.get('nameMembro');
    this.locale = this.cookieService.get('locale') || 'pt';
    this.param = {value: this.selectedMembroName || ''};
    if (this.locale === 'en'){
      this.papeis = [
        {name: 'Client', value: 'ROLE_CUSTOMER_REPRESENTATIVE'},
        {name: 'Requirement Analyst', value: 'ROLE_REQUIREMENT_ANALYST'},
        {name: 'Business Analyst', value: 'ROLE_BUSINESS_ANALYST'},
        {name: 'Test Analyst', value: 'ROLE_TEST_ANALYST'},
        {name: 'Programmer', value: 'ROLE_PROGRAMMER'}
      ];
      this.translate.get('GerenciarPapeis.Summary').subscribe((res: string) => {
        this.summary = res;
      });
      this.translate.get('GerenciarPapeis.Detail').subscribe((res: string) => {
        this.detail = res;
      });
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

  modificar(){
    this.projectService.updateRole(this.idProjeto, this.selectedMembroId, this.papelSelecionado.value).subscribe((response) => {
        this.messageService.add({severity: 'success', summary: this.summary, key: 'menuToast', detail: this.detail});
      },
      (error) => {
        throw error;
      });
  }
}
