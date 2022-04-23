import {Component, OnInit} from '@angular/core';
import {MessageService, TreeNode} from 'primeng/api';
import {CatalogueService} from '../catalogue.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {Style} from '../../interfaces/style';
import {TestDto} from '../../interfaces/test.dto';
import {Column} from '../../interfaces/column';

@Component({
  selector: 'app-editar-casos',
  templateUrl: './editar-casos.component.html',
  styleUrls: ['./editar-casos.component.css']
})
export class EditarCasosComponent implements OnInit {
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
    this.encontrarCasos();
    this.translate.get('EditarCasos.Summary').subscribe((res: string) => {
      this.summary = res;
    });
    this.translate.get('EditarCasos.Detail').subscribe((res: string) => {
      this.detail = res;
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

  encontrarCasos(){
    this.catalogueService.getReusedCases(this.idProjeto.toString()).subscribe((response) => {
        let node: TreeNode;
        node = {};
        node.data = {};
        node.data.name = 'TestCases';
        node.expanded = true;
        node.children = [];
        for (const test of response){
          node.children.push(this.catalogueService.testCaseToNode(test));
        }
        this.files = this.files.concat(node);
      },
      (error) => {
        throw error;
      });
  }

  toDto(){
    const testDto: TestDto = { id: this.selectedNode.data.id, name: this.selectedNode.data.name, mandatory: this.selectedNode.data.mandatory, priority: this.selectedNode.data.priority, entao: this.selectedNode.data.entao, quando: this.selectedNode.data.quando, sendoQue: this.selectedNode.data.sendoQue, scenario: this.selectedNode.data.scenario, functionalRequirement: this.selectedNode.data.functionalRequirement, entries: this.selectedNode.data.entries};
    return testDto;
  }

  voltarProjeto(){
    this.router.navigate(['app/projeto/informacoes']);
  }

}
