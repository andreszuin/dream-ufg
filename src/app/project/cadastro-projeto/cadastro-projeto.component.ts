import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ProjectService} from '../project.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import {Status} from '../../interfaces/status';
import {Visibilidade} from '../../interfaces/visibilidade';
import {Project} from '../../interfaces/project';
import {Style} from '../../interfaces/style';

@Component({
  selector: 'app-cadastro-projeto',
  templateUrl: './cadastro-projeto.component.html',
  styleUrls: ['./cadastro-projeto.component.css']
})
export class CadastroProjetoComponent implements OnInit {
  projetoForm: FormGroup;
  visibilidades: Visibilidade[];
  statuses: Status[];
  style: Style = {};
  errorMessage: string;
  projectDto: Project;
  locale: string;
  summary: string;
  detail: string;

  constructor(private router: Router, private projectService: ProjectService, private messageService: MessageService, private translate: TranslateService, private cookieService: CookieService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.style.width = '250px';
    this.projectDto = {};
  }

  ngOnInit(): void {
    this.projetoForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      keyWords: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      visibility: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
    this.locale = this.cookieService.get('locale') || 'pt';
    if (this.locale === 'en'){
      this.visibilidades = [
        {label: 'Private', value: false},
        {label: 'Public', value: true}
      ];
      this.statuses = [
        {label: 'In planning', value: 1},
        {label: 'In progress', value: 2}
      ];
    }
    else {
      this.visibilidades = [
        {label: 'Privado', value: false},
        {label: 'Publico', value: true}
      ];
      this.statuses = [
        {label: 'Em planejamento', value: 1},
        {label: 'Em andamento', value: 2}
      ];
    }
    this.translate.get('CadastroProjeto.Summary').subscribe((res: string) => {
      this.summary = res;
    });
    this.translate.get('CadastroProjeto.Detail').subscribe((res: string) => {
      this.detail = res;
    });
  }

  get name() {return this.projetoForm.get('name'); }

  get endDate() {return this.projetoForm.get('endDate'); }

  get keyWords() {return this.projetoForm.get('keyWords'); }

  get visibility() {return this.projetoForm.get('visibility'); }

  get status() {return this.projetoForm.get('status'); }

  projectDtoConstructor(){
    this.projectDto.name = this.name.value;
    this.projectDto.completionForecast = this.endDate.value;
    this.projectDto.visibility = this.visibility.value.value;
    this.projectDto.projectStatus = this.status.value.value;
    this.projectDto.keyWords = this.keyWords.value;
  }

  send(){
    this.projectDtoConstructor();
    this.projectService.addProject(this.projectDto).subscribe(
      (response) => {
        this.messageService.add({severity: 'success', summary: this.summary , key: 'menuToast', detail: this.detail});
      },
      (error) => {
        this.errorMessage = error;
        throw error;
      });
  }
}
