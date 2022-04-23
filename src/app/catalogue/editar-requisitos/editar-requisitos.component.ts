import {Component, OnInit} from '@angular/core';
import {CatalogueService} from '../catalogue.service';
import {MessageService, TreeNode} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {Style} from '../../interfaces/style';
import {FunctionalDto} from '../../interfaces/functional.dto';
import {NonFunctionalDto} from '../../interfaces/non-functional.dto';
import {Column} from '../../interfaces/column';

@Component({
  selector: 'app-editar-requisitos',
  templateUrl: './editar-requisitos.component.html',
  styleUrls: ['./editar-requisitos.component.css']
})
export class EditarRequisitosComponent implements OnInit {
  files: TreeNode[];
  selectedNode: TreeNode = {};
  nameProject: string;
  idProjeto: number;
  errorMessage: string;
  name: string;
  style: Style = {};
  cols: Column[];
  summary: string;
  detail: string;

  constructor(private catalogueService: CatalogueService, private route: ActivatedRoute, private messageService: MessageService, private router: Router, private cookieService: CookieService, private translate: TranslateService) {
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
    this.encontrarRequisitos();
    this.translate.get('EditarRequisitos.Summary').subscribe((res: string) => {
      this.summary = res;
    });
    this.translate.get('EditarRequisitos.Detail').subscribe((res: string) => {
      this.detail = res;
    });
  }

  encontrarRequisitos(){
    this.catalogueService.getReusedFunc(this.idProjeto.toString()).subscribe((response) => {
        let node: TreeNode;
        node = {};
        node.data = {};
        node.data.name = 'Functional';
        node.expanded = true;
        node.children = [];
        for (const func of response){
          node.children.push(this.catalogueService.functionalToNode(func));
        }
        this.files = this.files.concat(node);
      },
      (error) => {
        throw error;
      });

    this.catalogueService.getReusedNonFunc(this.idProjeto.toString()).subscribe((response) => {
        let node: TreeNode;
        node = {};
        node.data = {};
        node.data.name = 'NonFunctional';
        node.expanded = true;
        node.children = [];
        for (const nonfunc of response){
          node.children.push(this.catalogueService.nonFunctionalToNode(nonfunc));
        }
        this.files = this.files.concat(node);
      },
      (error) => {
        throw error;
      });
  }

  save(){
    this.catalogueService.update(this.selectedNode.data.tipo, this.selectedNode.data.id, this.toDto()).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: this.summary,
          key: 'menuToast',
          detail: this.detail
        });
      },
    (error) => {
      throw error;
    });
  }

  toDto(){
    if (this.selectedNode.data.tipo === 'nonfunctionalrequirement'){
      const nonfuncDto: NonFunctionalDto = { id: this.selectedNode.data.id, description: this.selectedNode.data.description, name: this.selectedNode.data.name, mandatory: this.selectedNode.data.mandatory, priority: this.selectedNode.data.priority};
      return nonfuncDto;
    }
    else if (this.selectedNode.data.tipo === 'functionalrequirement'){
      const funcDto: FunctionalDto = { id: this.selectedNode.data.id, name: this.selectedNode.data.name, mandatory: this.selectedNode.data.mandatory, priority: this.selectedNode.data.priority, como: this.selectedNode.data.como, euPosso: this.selectedNode.data.euPosso, paraQue: this.selectedNode.data.paraQue};
      return funcDto;
    }
  }

  voltarProjeto(){
    this.router.navigate(['app/projeto/informacoes']);
  }

}
