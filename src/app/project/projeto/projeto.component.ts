import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-projeto',
  templateUrl: './projeto.component.html',
  styleUrls: ['./projeto.component.css']
})
export class ProjetoComponent implements OnInit {
  name: string;
  constructor(private cookieService: CookieService) {
  }
  ngOnInit(): void {
    this.name = this.cookieService.get('projectName');
  }
}
