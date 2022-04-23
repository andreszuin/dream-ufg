import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-esqueceu-senha',
  templateUrl: './esqueceu-senha.component.html',
  styleUrls: ['./esqueceu-senha.component.css']
})
export class EsqueceuSenhaComponent implements OnInit {
  // TODO - implementar recuperação de senha
  constructor(private cookieService: CookieService, private translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use(this.cookieService.get('locale'));
  }

  ngOnInit(): void {
  }

}
