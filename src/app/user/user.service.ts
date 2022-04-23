import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}
  rootURL = '/api';

  addUser(personDto: any, recaptcha: string): Observable<any>{
    return this.http.post(this.rootURL + '/person?', personDto, {headers: {skip: 'true'}, params: {recaptcha}}).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }
  updateUser(params: any, id: number): Observable<any>{
    return this.http.patch(this.rootURL + '/person/' + id, params).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  changePassword(changePassword: any, id: number): Observable<any>{
    return this.http.patch(this.rootURL + '/person/' + id + '/change-password', changePassword).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  findUser(id: number) {
    return this.http.get(this.rootURL + '/person/' + id, {observe: 'body', responseType: 'json'}).pipe(map((data: any) => {
      return data;
    }));
  }

  getProjects(id: number){
    return this.http.get(this.rootURL + '/person/' + id + '/projects/', {observe: 'body', responseType: 'json'}).pipe(map((data: any) => {
      return data;
    }));
  }

  findAll(){
    return this.http.get(this.rootURL + '/person/', {observe: 'body', responseType: 'json'}).pipe(map((data: any) => {
      return data;
    }));
  }

  findByEmail(email: string){
    return this.http.get(this.rootURL + '/person/email', {observe: 'body', responseType: 'json', params: {email}}).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

}
