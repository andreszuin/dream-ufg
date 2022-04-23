import { Component, OnInit } from '@angular/core';
import {MessageService, TreeNode} from 'primeng/api';
import {CatalogueService} from '../catalogue.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {Style} from '../../interfaces/style';
import {Catalogo} from '../../interfaces/catalogo';
import {Column} from '../../interfaces/column';

@Component({
  selector: 'app-reusar-padroes',
  templateUrl: './reusar-padroes.component.html',
  styleUrls: ['./reusar-padroes.component.css']
})
export class ReusarPadroesComponent implements OnInit {
  files: TreeNode[];
  file: TreeNode;
  selectedNode: TreeNode = {};
  errorMessage: string;
  nameProject: string;
  idProjeto: number;
  idCatalogo: number;
  catalogo: Catalogo;
  style: Style = {};
  cols: Column[];

  constructor(private catalogueService: CatalogueService, private route: ActivatedRoute, private messageService: MessageService, private router: Router, private cookieService: CookieService, private translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.style.width = '250px';
    this.selectedNode.data = {};
    this.catalogo = {};
  }

  ngOnInit(): void {
    this.idProjeto = +this.cookieService.get('idProjeto');
    this.nameProject = this.cookieService.get('projectName');
    this.idCatalogo = +this.cookieService.get('idCatalogo');
    this.files = [];
    this.cols = [
      {field: 'name', header: 'Name', width: '85%'},
      {field: 'reused', header: 'Reused', width: '15%'}
    ];
    this.encontrarCatalogo();
  }

  encontrarCatalogo(){
    this.catalogueService.findCatalogueId(this.idCatalogo).subscribe((response) => {
        this.catalogo = response;
        this.files = [this.catalogueService.catalogueToNode(this.catalogo)];
      },
      (error) => {
        throw error;
      });
  }

  reusar(){
    this.catalogueService.reuse(this.selectedNode.data.tipo, this.selectedNode.data.reused, this.selectedNode.data.id, String(this.idProjeto)).subscribe((response) => {
        this.encontrarCatalogo();
      },
      (error) => {
        throw error;
      });
  }

  voltarProjeto(){
    this.router.navigate(['app/projeto/informacoes']);
  }

}
