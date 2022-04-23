import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  rootURL = '/login';

  login(user: string, password: string): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        skip:  'true',
        Authorization:  'Basic ZHJlYW06MTIzNDU2'
      })
    };
    return this.http.post(this.rootURL, 'username=' + user + '&password=' + password + '&grant_type=password', httpOptions).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        this.cookieService.delete('token', '');
        this.cookieService.set('token', data.access_token, {path: ''});
        return data;
      })
    );
  }

  getId(email: string): Observable<any>{
    const params = new HttpParams()
      .set('email', email);
    return this.http.get('/api/person/email', {params}).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }
}
