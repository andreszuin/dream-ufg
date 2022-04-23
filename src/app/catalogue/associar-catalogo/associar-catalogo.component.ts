import {Component, OnInit} from '@angular/core';
import {MessageService, TreeNode} from 'primeng/api';
import {CatalogueService} from '../catalogue.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {Style} from '../../interfaces/style';
import {Column} from '../../interfaces/column';

@Component({
  selector: 'app-associar-catalogo',
  templateUrl: './associar-catalogo.component.html',
  styleUrls: ['./associar-catalogo.component.css']
})
export class AssociarCatalogoComponent implements OnInit {
  files: TreeNode[];
  file: TreeNode;
  selectedNode: TreeNode = {};
  errorMessage: string;
  name: string;
  nameProject: string;
  catalogos: object[];
  style: Style = {};
  cols: Column[];
  idProjeto: number;
  idCatalogo: number;
  view: string;
  summary: string;
  detail: string;

  constructor(private translate: TranslateService, private catalogueService: CatalogueService, private route: ActivatedRoute, private messageService: MessageService, private router: Router, private cookieService: CookieService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.style.width = '250px';
    this.selectedNode.data = {};
    this.catalogos = [];
    this.view = 'search';
  }

  ngOnInit(): void {
    this.idProjeto = +this.cookieService.get('idProjeto');
    this.nameProject = this.cookieService.get('projectName');
    this.files = [];
    this.cols = [
      {field: 'name', header: 'Name', type: 'type'}
    ];
    this.encontrarCatalogo();
    this.translate.get('AssociarCatalogo.Summary').subscribe((res: string) => {
      this.summary = res;
    });
    this.translate.get('AssociarCatalogo.Detail').subscribe((res: string) => {
      this.detail = res;
    });
  }

  encontrarCatalogo(){
    this.catalogueService.getAllCatalogues().subscribe((response) => {
        this.catalogos = response;
      },
      (error) => {
        throw error;
      });
  }

  showInfo(catalogue: any){
    this.idCatalogo = catalogue.id;
    this.view = 'info';
    this.files = [this.catalogueService.catalogueToNode(catalogue)];
    this.selectedNode.data = {};
  }

  voltar(){
    this.view = 'search';
  }

  voltarProjeto(){
    this.router.navigate(['app/projeto/informacoes']);
  }

  associar(){
    this.catalogueService.associateCatalogue(this.idProjeto, this.idCatalogo).subscribe(
      (response) => {
        this.messageService.add({severity: 'success', summary: this.summary , key: 'menuToast', detail: this.detail});
      },
      (error) => {
        throw error;
      });
  }
}
