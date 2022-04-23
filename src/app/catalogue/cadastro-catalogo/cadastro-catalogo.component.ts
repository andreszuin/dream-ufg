import { Component, OnInit } from '@angular/core';
import {CatalogueService} from '../catalogue.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
@Component({
  selector: 'app-cadastro-catalogo',
  templateUrl: './cadastro-catalogo.component.html',
  styleUrls: ['./cadastro-catalogo.component.css']
})
export class CadastroCatalogoComponent implements OnInit {
  xmlDoc: XMLDocument;
  xmlData: string;
  xmlFileName: string;
  errorMessage: string;
  validated: boolean;
  registered: boolean;
  summary: string;
  detail: string;

  constructor(private catalogueService: CatalogueService, private messageService: MessageService, private translate: TranslateService, private cookieService: CookieService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
  }

  ngOnInit(): void {
    this.xmlData = '';
    this.translate.get('CadastroCatalogo.Summary').subscribe((res: string) => {
      this.summary = res;
    });
    this.translate.get('CadastroCatalogo.Detail').subscribe((res: string) => {
      this.detail = res;
    });
  }

  onFileInput($event){
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.xmlData = e.target.result as string;
    };
    fileReader.readAsText($event.target.files[0]);
    this.xmlFileName = $event.target.files[0].name;
    setTimeout(() => { const parser = new DOMParser();
                       this.xmlDoc = parser.parseFromString(this.xmlData, 'application/xml');
                       this.validated = false;
                       this.registered = false; }, 500);
  }

  send() {
    this.catalogueService.createCatalogue(this.xmlData).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: this.summary,
          key: 'menuToast',
          detail: this.detail
        });
      },
      (error) => {
        this.errorMessage = error;
        if (this.errorMessage === 'catalogue.already.exists') {
          this.registered = true;
        }
        if (this.errorMessage === 'catalogue.not.validated') {
          this.validated = true;
        }
        throw error;
      });
  }
}
