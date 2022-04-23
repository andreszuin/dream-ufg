import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {TreeNode} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})

export class CatalogueService {

  constructor(private http: HttpClient) { }
  rootURL = '/api';

  createCatalogue(catalogue: string): Observable<any>{
    return this.http.post(this.rootURL + '/catalogue?', catalogue).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  findCatalogue(name: string): Observable<any>{
    return this.http.get(this.rootURL + '/catalogue/name', {observe: 'body', responseType: 'json', params: {name}}).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }

  findCatalogueId(id: number): Observable<any>{
    return this.http.get(this.rootURL + '/catalogue/' + id, {observe: 'body', responseType: 'json'}).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }

  getReusedPatterns(id: string): Observable<any>{
    return this.http.get(this.rootURL + '/softwarepattern/reused', {observe: 'body', responseType: 'json', params: {id} }).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }

  getReusedFunc(id: string): Observable<any>{
    return this.http.get(this.rootURL + '/functionalrequirement/reused', {observe: 'body', responseType: 'json', params: {id} }).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }

  getReusedNonFunc(id: string): Observable<any>{
    return this.http.get(this.rootURL + '/nonfunctionalrequirement/reused', {observe: 'body', responseType: 'json', params: {id} }).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }

  getReusedCases(id: string): Observable<any>{
    return this.http.get(this.rootURL + '/testcase/reused', {observe: 'body', responseType: 'json', params: {id} }).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }

  reuse(tipo: string, reuse: string, id: string, projectId: string){
    const params = new HttpParams()
      .set('reuse', reuse)
      .set('projectId', projectId)
      .set('id', id);
    return this.http.patch(this.rootURL + '/' + tipo + '/reuse', params).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  update(tipo: string, id: string, dto: any){
    return this.http.put(this.rootURL + '/' + tipo + '/' + id + '/update', dto).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  getAllCatalogues(): Observable<any>{
    return this.http.get(this.rootURL + '/catalogue/findall', {observe: 'body', responseType: 'json'}).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      }),
      map((data: any) => {
        return data;
      })
    );
  }

  associateCatalogue(idProjeto: number, idCatalogo: number): Observable<any>{
    return this.http.post(this.rootURL + '/project/' + idProjeto + '/catalogue/' + idCatalogo + '/associate', {}).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  catalogueToNode(catalogue: any){
    let node: TreeNode;
    node = {};
    node.expanded = true;
    node.data = {};
    node.data.id = catalogue.id;
    node.data.name = catalogue.name;
    node.data.version = catalogue.version;
    node.data.reused = catalogue.reused;
    node.data.tipo = 'catalogue';
    node.children = [];
    for (const bag of catalogue.bags){
      node.children.push(this.bagToNode(bag));
    }
    return node;
  }

  bagToNode(bag: any){
    let node: TreeNode;
    node = {};
    node.expanded = true;
    node.data = {};
    node.data.id = bag.id;
    node.data.name = bag.name;
    node.data.intent = bag.intent;
    node.data.keywords = bag.keywords;
    node.data.reused = bag.reused;
    node.data.tipo = 'bag';
    node.children = [];
    for (const pattern of bag.patterns){
      node.children.push(this.patternToNode(pattern));
    }
    return node;
  }

  patternToNode(pattern: any){
    let node: TreeNode;
    node = {};
    node.data = {};
    node.data.id = pattern.id;
    node.data.name = pattern.name;
    node.data.type = pattern.type;
    node.data.problem = pattern.problem;
    node.data.forces = pattern.forces;
    node.data.context = pattern.context;
    node.data.solution = pattern.solution;
    node.data.version = pattern.version;
    node.data.sources = pattern.sources;
    node.data.author = pattern.author;
    node.data.reused = pattern.reused;
    node.data.tipo = 'softwarepattern';
    node.children = [];
    if (pattern.type.includes('NonFunctionalReqPattern')){
      for (const nonFunc of pattern.nonFunctionals){
        node.children.push(this.nonFunctionalToNode(nonFunc));
      }
    }
    else if (pattern.type.includes('FunctionalReqPattern')){
      for (const func of pattern.functionals){
        node.children.push(this.functionalToNode(func));
      }
    }
    else if (pattern.type.includes('AcceptanceTestPattern')){
      for (const test of pattern.tests){
        node.children.push(this.testCaseToNode(test));
      }
    }
    return node;
  }

  functionalToNode(func: any){
    let node: TreeNode;
    node = {};
    node.data = {};
    node.data.id = func.id;
    node.data.name = func.name;
    node.data.como = func.como;
    node.data.euPosso = func.euPosso;
    node.data.paraQue = func.paraQue;
    node.data.reused = func.reused;
    node.data.priority = func.priority;
    node.data.mandatory = func.isMandatory;
    node.data.tipo = 'functionalrequirement';
    node.data.frId = func.frId;
    return node;
  }

  nonFunctionalToNode(nonFunc: any){
    let node: TreeNode;
    node = {};
    node.data = {};
    node.data.id = nonFunc.id;
    node.data.name = nonFunc.name;
    node.data.description = nonFunc.description;
    node.data.reused = nonFunc.reused;
    node.data.priority = nonFunc.priority;
    node.data.mandatory = nonFunc.isMandatory;
    node.data.tipo = 'nonfunctionalrequirement';
    node.data.nfrId = nonFunc.nfrId;
    return node;
  }

  testCaseToNode(test: any){
    let node: TreeNode;
    node = {};
    node.data = {};
    node.data.id = test.id;
    node.data.name = test.name;
    node.data.sendoQue = test.sendoQue;
    node.data.quando = test.quando;
    node.data.entao = test.entao;
    node.data.entries = test.entries;
    node.data.scenario = test.scenario;
    node.data.functionalRequirement = test.functionalRequirement;
    node.data.reused = test.reused;
    node.data.priority = test.priority;
    node.data.mandatory = test.isMandatory;
    node.data.tipo = 'testcase';
    node.data.tcId = test.tcId;
    return node;
  }
}
