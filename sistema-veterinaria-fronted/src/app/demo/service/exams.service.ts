import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exams } from '../api/exams';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {
  private apiUrl = "http://localhost:8085/api/v1/admin/exams";  

  constructor(private http:HttpClient,
    private headerService : HeaderService) { }
  
  createExams(exams: Exams):Observable<Exams>{
    return this.http.post<Exams>(this.apiUrl, exams,{headers:this.headerService.headers});
  }

  updateExams(id: number, exams: Exams): Observable<Exams> {
    return this.http.put<Exams>(`${this.apiUrl}/${id}`, exams,{headers:this.headerService.headers});
  }

  getExamslist():Observable<Exams[]>{
    return this.http.get<Exams[]>(this.apiUrl,{headers:this.headerService.headers});
  }
  getExamsById(id:number):Observable<Exams>{
    return this.http.get<Exams>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deleteExamsId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  deleteSelectedExams(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
  }
}
