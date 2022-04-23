import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {DocumentsService} from '../documents.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {CatalogueService} from '../../catalogue/catalogue.service';
import {Statistic} from '../../interfaces/statistic';
import {Options} from '../../interfaces/options';
import {Tipo} from '../../interfaces/tipo';
import {Catalogo} from '../../interfaces/catalogo';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {
  idCatalogo: number;
  report: Map<string, Statistic[]>;
  name: '';
  types: Tipo[] = [];
  selectedType: Tipo = {};
  locale: string;

  catalogo: Catalogo = {
    name: ''
  };
  dataSet: any = {};
  dataSet2: any = {};
  horizontalOptions: any;
  projects: Options[] = [];
  selectedProject: Options = {};
  constructor(private cookieService: CookieService,
              private documentsService: DocumentsService,
              private catalogueService: CatalogueService,
              private translate: TranslateService,
              private router: Router) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
  }

  ngOnInit(): void {
    this.locale = this.cookieService.get('locale') || 'pt';
    this.idCatalogo = +this.cookieService.get('idCatalogo');
    if (this.locale === 'pt'){
      this.types = [
        {label: 'Funcional', value: 'sopammV3:FunctionalReqPattern'},
        {label: 'Não Funcional', value: 'sopammV3:NonFunctionalReqPattern'},
        {label: 'Teste de Aceitação', value: 'sopammV3:AcceptanceTestPattern'}
      ];
    }
    else{
      this.types = [
        {label: 'Functional', value: 'sopammV3:FunctionalReqPattern'},
        {label: 'Non Functional', value: 'sopammV3:NonFunctionalReqPattern'},
        {label: 'Acceptance Test', value: 'sopammV3:AcceptanceTestPattern'}
      ];
    }
    this.documentsService.getReport(this.idCatalogo).subscribe((response) => {
        this.report = response;
        this.projects = [];
        // tslint:disable-next-line:forin
        for (const key in this.report){
          this.projects.push({label: key, value: this.report[key]});
        }
        console.log(this.projects);
      },
      (error) => {
        throw error;
      });
    this.catalogueService.findCatalogueId(this.idCatalogo).subscribe((response) => {
        this.catalogo = response;
      },
      (error) => {
        throw error;
      });

    this.horizontalOptions = {
        legend: {
          position: 'bottom',
          labels: {
            fontColor: '#063E58'
          }
        }
    };
  }

  voltar(){
    this.router.navigate(['/app/pesquisar-catalogo']);
  }

  preencherGrafico(){
    let sumFr = 0;
    let sumFrMod = 0;
    let sumNFr = 0;
    let sumNFrMod = 0;
    let sumAt = 0;
    let sumAtMod = 0;
    this.selectedProject.value.forEach( (stat) => {
      if (stat.tipo === 'sopammV3:FunctionalReqPattern'){
        sumFr += stat.reusado;
        sumFrMod += stat.modificado;
      }
      if (stat.tipo === 'sopammV3:NonFunctionalReqPattern'){
        sumNFr += stat.reusado;
        sumNFrMod += stat.modificado;
      }
      if (stat.tipo === 'sopammV3:AcceptanceTestPattern'){
        sumAt += stat.reusado;
        sumAtMod += stat.modificado;
      }
    });
    if (this.locale === 'pt') {
      this.dataSet = {
        labels: ['Funcional', 'Não Funcional', 'Testes de Aceitação'],
        datasets: [
          {
            label: 'Reusados sem modificação',
            backgroundColor: '#063E58',
            data: [sumFr, sumNFr, sumAt]
          },
          {
            label: 'Reusados com modificação',
            backgroundColor: '#FFA726',
            data: [sumFrMod, sumNFrMod, sumAtMod]
          }
        ]
      };
      this.dataSet2 = {
        labels: ['Padrões'],
        datasets: [
          {
            label: 'Reusados sem modificação',
            backgroundColor: '#063E58',
            data: [sumFr + sumNFr + sumAt]
          },
          {
            label: 'Reusados com modificação',
            backgroundColor: '#FFA726',
            data: [sumFrMod + sumNFrMod + sumAtMod]
          }
        ]
      };
    }
    else{
      this.dataSet = {
        labels: ['Functional', 'Non Functional', 'Acceptance Tests'],
        datasets: [
          {
            label: 'Reused without modifications',
            backgroundColor: '#063E58',
            data: [sumFr, sumNFr, sumAt]
          },
          {
            label: 'Reused with modifications',
            backgroundColor: '#FFA726',
            data: [sumFrMod, sumNFrMod, sumAtMod]
          }
        ]
      };
      this.dataSet2 = {
        labels: ['Patterns'],
        datasets: [
          {
            label: 'Reused without modifications',
            backgroundColor: '#063E58',
            data: [sumFr + sumNFr + sumAt]
          },
          {
            label: 'Reused with modifications',
            backgroundColor: '#FFA726',
            data: [sumFrMod + sumNFrMod + sumAtMod]
          }
        ]
      };
    }
  }

}
