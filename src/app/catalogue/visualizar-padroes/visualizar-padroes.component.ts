import { Component, OnInit } from '@angular/core';
import {TreeNode} from 'primeng/api';
import {CatalogueService} from '../catalogue.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {Style} from '../../interfaces/style';
import {Column} from '../../interfaces/column';

@Component({
  selector: 'app-visualizar-padroes',
  templateUrl: './visualizar-padroes.component.html',
  styleUrls: ['./visualizar-padroes.component.css']
})
export class VisualizarPadroesComponent implements OnInit {

  files: TreeNode[];
  file: TreeNode;
  selectedNode: TreeNode = {};
  errorMessage: string;
  name: string;
  style: Style = {};
  cols: Column[];
  nameProject: string;
  idProjeto: number;

  constructor(private catalogueService: CatalogueService, private route: ActivatedRoute, private router: Router, private cookieService: CookieService, private translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
    this.style.width = '250px';
    this.selectedNode.data = {};
  }

  ngOnInit(): void {
    this.idProjeto = +this.cookieService.get('idProjeto');
    this.nameProject = this.cookieService.get('projectName');
    this.files = [];
    this.cols = [
      {field: 'name', header: 'Name', type: 'type'}
    ];
    this.encontrarPadroes();
  }

  encontrarPadroes(){
    this.catalogueService.getReusedPatterns(String(this.idProjeto)).subscribe((response) => {
        let node: TreeNode;
        node = {};
        node.data = {};
        node.data.name = 'Patterns';
        node.expanded = true;
        node.children = [];
        for (const pat of response){
          node.children.push(this.catalogueService.patternToNode(pat));
        }
        this.files = this.files.concat(node);
      },
      (error) => {
        throw error;
      });
  }

  voltarProjeto(){
    this.router.navigate(['app/projeto/informacoes']);
  }

}
