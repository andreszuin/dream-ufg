import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(private http: HttpClient) { }
  rootURL = '/api';

  getFormalDocSRS(idProjeto: number, lang: string, tipo: string): Observable<HttpEvent<Blob>>{
    const params = new HttpParams()
      .set('projectId', idProjeto.toString())
      .set('tipo', tipo);
    return this.http.get(this.rootURL + '/doc/SRS/' + lang, {observe: 'events', responseType: 'blob', params }).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  getFormalDocECT(idProjeto: number, lang: string, tipo: string): Observable<HttpEvent<Blob>>{
    const params = new HttpParams()
      .set('projectId', idProjeto.toString())
      .set('tipo', tipo);
    return this.http.get(this.rootURL + '/doc/ECT/' + lang, {observe: 'events', responseType: 'blob', params }).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  getMatriz(idProjeto: number, tipo: string, lang: string): Observable<HttpEvent<Blob>>{
    const params = new HttpParams()
      .set('projectId', idProjeto.toString())
      .set('tipo', tipo);
    return this.http.get(this.rootURL + '/doc/matrix/' + lang, {observe: 'events', responseType: 'blob', params }).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  print(idCatalogo: number, lang: string): Observable<HttpEvent<Blob>>{
    const params = new HttpParams()
      .set('catalogueId', idCatalogo.toString());
    return this.http.get(this.rootURL + '/print/catalogue/' + lang, {observe: 'events', responseType: 'blob', params }).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  getReport(idCatalogo: number): Observable<any>{
    console.log(idCatalogo);
    return this.http.get(this.rootURL + '/report/statistic/' + idCatalogo, {observe: 'body', responseType: 'json'}).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }
}
