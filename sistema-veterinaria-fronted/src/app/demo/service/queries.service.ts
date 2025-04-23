import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Queries } from '../api/queries';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class QueriesService {

  private apiUrl = "http://localhost:8085/api/v1/admin/queries";  

  constructor(private http:HttpClient,
    private headerService : HeaderService) { }
  
  createQueries(queries: Queries):Observable<Queries>{
    return this.http.post<Queries>(this.apiUrl, queries,{headers:this.headerService.headers});
  }

  updateQueries(id: number, queries: Queries): Observable<Queries> {
    return this.http.put<Queries>(`${this.apiUrl}/${id}`, queries,{headers:this.headerService.headers});
  }

  getQuerieslist():Observable<Queries[]>{
    return this.http.get<Queries[]>(this.apiUrl,{headers:this.headerService.headers});
  }
  getQueriesById(id:number):Observable<Queries>{
    return this.http.get<Queries>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deleteQueriesId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  deleteSelectedQueries(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
  }
}
