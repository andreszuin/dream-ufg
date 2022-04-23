import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  constructor(private cookieService: CookieService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = this.cookieService.get('token');
    if (req.headers.get('skip')) {
      req = req.clone({
        headers: req.headers.delete('skip')
      });
      return next.handle(req);
    }
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.token
      }
    });
    return next.handle(req);
  }
}
