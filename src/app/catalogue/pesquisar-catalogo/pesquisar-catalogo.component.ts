import {Component, OnInit} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {CatalogueService} from '../catalogue.service';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {DocumentsService} from '../../documents/documents.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {saveAs} from 'file-saver';
import {Router} from '@angular/router';
import {Style} from '../../interfaces/style';
import {Column} from '../../interfaces/column';
import {Catalogo} from '../../interfaces/catalogo';

@Component({
  selector: 'app-pesquisar-catalogo',
  templateUrl: './pesquisar-catalogo.component.html',
  styleUrls: ['./pesquisar-catalogo.component.css']
})
export class PesquisarCatalogoComponent implements OnInit {
  files: TreeNode[];
  file: TreeNode;
  selectedNode: TreeNode = {};
  errorMessage: string;
  name: string;
  catalogos: object[];
  catalogo: Catalogo;
  style: Style = {};
  cols: Column[];
  view: string;
  catalogueId: number;

  constructor(private catalogueService: CatalogueService,
              private cookieService: CookieService,
              private translate: TranslateService,
              private documentsService: DocumentsService,
              private router: Router) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.style.width = '250px';
    this.selectedNode.data = {};
    this.catalogos = [];
    this.catalogo = {};
    this.view = 'search';
  }

  ngOnInit(): void {
    this.files = [];
    this.cols = [
      {field: 'name', header: 'Name', type: 'type'}
    ];
    this.encontrarCatalogo();
  }

  encontrarCatalogo(){
    this.catalogueService.getAllCatalogues().subscribe((response) => {
      this.catalogos = response;
      console.log(this.catalogos);
      },
      (error) => {
        throw error;
      });
  }

  showInfo(catalogue: any){
    this.view = 'info';
    this.files = [this.catalogueService.catalogueToNode(catalogue)];
    this.selectedNode.data = {};
    this.catalogueId = catalogue.id;
  }

  voltar(){
    this.view = 'search';
  }

  print(){
    console.log(this.catalogueId);
    this.documentsService.print(this.catalogueId, this.cookieService.get('locale') || 'pt').subscribe(
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

  report() {
    this.cookieService.delete('idCatalogo', '');
    this.cookieService.set('idCatalogo', this.catalogueId.toString(), {path: ''});
    this.router.navigate(['app/relatorio']);
  }
}
