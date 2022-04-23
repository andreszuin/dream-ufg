import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }
  rootURL = '/api';

  addProject(projectDto: any): Observable<any>{
    return this.http.post(this.rootURL + '/project?', projectDto).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  updateProject(id: number, body: any): Observable<any>{
    return this.http.patch(this.rootURL + '/project/' + id, body).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  findProjectbyName(name: string): Observable<any>{
    return this.http.get(this.rootURL + '/project/name', {observe: 'body', responseType: 'json', params: {name}}).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }

  getCatalogues(id: number): Observable<any>{
    return this.http.get(this.rootURL + '/project/' + id + '/catalogues', {observe: 'body', responseType: 'json'}).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }

  addMember(idProjeto: number, idUsuario: number, papel: string): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };
    return this.http.post(this.rootURL + '/project/' + idProjeto + '/add-member?', 'idPerson=' + idUsuario + '&projectRoleType=' + papel, httpOptions).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  getMembers(idProjeto: number): Observable<any>{
    return this.http.get(this.rootURL + '/project/' + idProjeto + '/members', {observe: 'body', responseType: 'json'}).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }

  removeMember(idProjeto: number, idMembro: number): Observable<any>{
    return this.http.delete(this.rootURL + '/project/' + idProjeto + '/member/' + idMembro).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  updateRole(idProjeto: number, idMembro: number, papel: string): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };
    const params = new HttpParams()
      .set('projectRoleType', papel);
    return this.http.post(this.rootURL + '/project/' + idProjeto + '/member/' + idMembro + '/change-role?', params, httpOptions).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }
}
