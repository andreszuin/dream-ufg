import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import {ProjectService} from '../project.service';
import {formatDate} from '@angular/common';
import {MessageService} from 'primeng/api';
import {HttpParams} from '@angular/common/http';
import {Style} from '../../interfaces/style';
import {Visibilidade} from '../../interfaces/visibilidade';
import {Status} from '../../interfaces/status';
import {Project} from '../../interfaces/project';

@Component({
  selector: 'app-atualizar-projeto',
  templateUrl: './atualizar-projeto.component.html',
  styleUrls: ['./atualizar-projeto.component.css']
})
export class AtualizarProjetoComponent implements OnInit {
  // TODO debug
  projetoForm: FormGroup;
  projectName: string;
  projeto: Project;
  errorMessage: string;
  dateFormat: string;
  visibilidades: Visibilidade[];
  statuses: Status[];
  style: Style = {};
  locale: string;
  summary: string;
  detail: string;

  constructor(private translate: TranslateService, private cookieService: CookieService, private projectService: ProjectService, private messageService: MessageService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.style.width = '250px';
  }

  ngOnInit(): void {
    this.projectName = this.cookieService.get('projectName');
    this.translate.get('InformacoesProjeto.DateFormat').subscribe((res: string) => {
      this.dateFormat = res;
    });
    this.projetoForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      keyWords: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      visibility: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
    this.projectService.findProjectbyName(this.projectName).subscribe(
      (response) => {
        this.projeto = response;
        this.cookieService.delete('idProjeto', '');
        this.cookieService.set('idProjeto', this.projeto.id.toString(), {path: ''});
        this.format();
        this.projetoForm.setValue({
          name: this.projeto.name,
          keyWords: this.projeto.keyWords,
          endDate: this.projeto.completionForecast,
          visibility: this.projeto.visibility,
          status: this.projeto.projectStatus
        });
        console.log(this.projetoForm);
      },
      (error) => {
        throw error;
      });
    this.locale = this.cookieService.get('locale') || 'pt';
    if (this.locale === 'en'){
      this.visibilidades = [
        {label: 'Private', value: false},
        {label: 'Public', value: true}
      ];
      this.statuses = [
        {label: 'In planning', value: 1},
        {label: 'In progress', value: 2},
        {label: 'Concluded', value: 3}
      ];
    }
    else {
      this.visibilidades = [
        {label: 'Privado', value: false},
        {label: 'Publico', value: true}
      ];
      this.statuses = [
        {label: 'Em planejamento', value: 1},
        {label: 'Em andamento', value: 2},
        {label: 'Concluido', value: 3}
      ];
    }
    this.translate.get('AtualizarProjeto.Summary').subscribe((res: string) => {
      this.summary = res;
    });
    this.translate.get('AtualizarProjeto.Detail').subscribe((res: string) => {
      this.detail = res;
    });
  }

  format(){
    if (this.projeto.visibility === true){
      this.projeto.visibility = {value: true};
    }
    else{
      this.projeto.visibility = {value: false};
    }
    if (this.projeto.projectStatus === 'Planejamento'){
      this.projeto.projectStatus = {value: 1};
    }
    else if (this.projeto.projectStatus === 'Andamento'){
      this.projeto.projectStatus = {value: 2};
    }
    else {
      this.projeto.projectStatus = {value: 3};
    }
    this.projeto.completionForecast = formatDate(this.projeto.completionForecast, this.dateFormat, 'en');
  }

  get name() {return this.projetoForm.get('name'); }

  get endDate() {return this.projetoForm.get('endDate'); }

  get keyWords() {return this.projetoForm.get('keyWords'); }

  get visibility() {return this.projetoForm.get('visibility'); }

  get status() {return this.projetoForm.get('status'); }

  projectDtoConstructor(){
    this.projeto.name = this.name.value;
    this.projeto.completionForecast = this.endDate.value;
    this.projeto.visibility = this.visibility.value.value;
    this.projeto.projectStatus = this.status.value.value;
    this.projeto.keyWords = this.keyWords.value;
  }

  send(){
    this.projectDtoConstructor();
    const body = new HttpParams().set('name', this.name.value)
      .set('completionForecast', this.endDate.value)
      .set('visibility', this.visibility.value.value)
      .set('projectStatus', this.status.value.value)
      .set('keyWords', this.keyWords.value);
    this.projectService.updateProject(this.projeto.id, body).subscribe(
      (response) => {
        this.messageService.add({severity: 'success', summary: this.summary , key: 'menuToast', detail: this.detail});
      },
      (error) => {
        this.errorMessage = error;
        throw error;
      });
  }

}
