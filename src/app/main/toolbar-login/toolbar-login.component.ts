import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-toolbar-login',
  templateUrl: './toolbar-login.component.html',
  styleUrls: ['./toolbar-login.component.css']
})
export class ToolbarLoginComponent implements OnInit {

  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {  }

  changeLocale(locale: string){
    this.cookieService.delete('locale', '');
    this.cookieService.set('locale', locale, {path: ''});
    window.location.reload();
  }
}
