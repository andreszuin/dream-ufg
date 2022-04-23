import {Component, OnInit} from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../project.service';
import {AtualizarProjetoComponent} from '../atualizar-projeto/atualizar-projeto.component';
import {formatDate} from '@angular/common';
import {CookieService} from 'ngx-cookie-service';
import {DocumentsService} from '../../documents/documents.service';
import {saveAs} from 'file-saver';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {Project} from '../../interfaces/project';

@Component({
  selector: 'app-informacoes-projeto',
  templateUrl: './informacoes-projeto.component.html',
  styleUrls: ['./informacoes-projeto.component.css']
})
export class InformacoesProjetoComponent implements OnInit {
  catalogos: [];
  name: string;
  projeto: Project;
  displayFormal: boolean;
  displayMatrix: boolean;
  dateFormat: string;
  locale: string;
  constructor(private dialogService: DialogService, private router: Router, private route: ActivatedRoute,
              private projectService: ProjectService, private cookieService: CookieService, private documentsService: DocumentsService, private translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.locale = this.cookieService.get('locale') || 'pt';
    this.projeto = {};
    this.displayFormal = false;
    this.displayMatrix = false;
  }

  ngOnInit(): void {
    this.name = this.cookieService.get('projectName');
    this.projectService.findProjectbyName(this.name).subscribe(
      (response) => {
        this.projeto = response;
        this.cookieService.delete('idProjeto', '');
        this.cookieService.set('idProjeto', this.projeto.id.toString(), {path: ''});
        this.format();
        this.getCatalogues();
      },
      (error) => {
        throw error;
      });
    this.translate.get('InformacoesProjeto.DateFormat').subscribe((res: string) => {
      this.dateFormat = res;
    });
  }

  getCatalogues(){
    this.projectService.getCatalogues(this.projeto.id).subscribe(
      (response) => {
        this.catalogos = response;
      },
      (error) => {
        throw error;
      });
  }


  showConfig(){
    const ref = this.dialogService.open(AtualizarProjetoComponent, {
      width: '400px'
    });
  }

  reuse(catalogue: any){
    this.cookieService.delete('idCatalogo', '');
    this.cookieService.set('idCatalogo', catalogue.id.toString(), {path: ''});
    this.router.navigate(['app/projeto/reusar']);
  }

  showMembers(){
    this.router.navigate(['app/projeto/membros']);
  }

  addCatalogues(){
    this.router.navigate(['app/projeto/associar-catalogos']);
  }

  editRequirements(){
    this.router.navigate(['app/projeto/editar-requisitos']);
  }

  editCases(){
    this.router.navigate(['app/projeto/editar-casos']);
  }

  viewPatterns(){
    this.router.navigate(['app/projeto/visualizar-padroes']);
  }

  optionsFormal(){
    this.displayFormal = true;
  }

  formal(tipo: string){
    this.displayFormal = false;
    this.documentsService.getFormalDocSRS(this.projeto.id, this.cookieService.get('locale') || 'pt', tipo).subscribe(
      event => {
        console.log(event);
        this.download(event);
      },
      (error) => {
        throw error;
      });
    this.documentsService.getFormalDocECT(this.projeto.id, this.cookieService.get('locale') || 'pt', tipo).subscribe(
      event => {
        console.log(event);
        this.download(event);
      },
      (error) => {
        throw error;
      });
  }

  optionsMatriz(){
    this.displayMatrix = true;
  }

  matriz(tipo: string){
    this.displayMatrix = false;
    this.documentsService.getMatriz(this.projeto.id, tipo, this.cookieService.get('locale') || 'pt').subscribe(
      event => {
        console.log(event);
        this.download(event);
      },
      (error) => {
        throw error;
      });
  }

  download(httpEvent: HttpEvent<Blob>){
    if (httpEvent.type === HttpEventType.Response){
      saveAs(new File([httpEvent.body], httpEvent.headers.get('File-Name'), {type: httpEvent.headers.get('Content-Type') + ';charset=utf-8'}));
    }
  }

  format(){
    if (this.projeto.visibility === true){
      if (this.locale === 'pt'){
        this.projeto.visibility = 'Publico';
      }
      else{
        this.projeto.visibility = 'Public';
      }
    }
    else{
      if (this.locale === 'pt'){
        this.projeto.visibility = 'Privado';
      }
      else{
        this.projeto.visibility = 'Private';
      }
    }
    this.projeto.completionForecast = formatDate(this.projeto.completionForecast, this.dateFormat, 'en');
  }
}
