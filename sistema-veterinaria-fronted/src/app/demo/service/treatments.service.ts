import { Injectable } from '@angular/core';
import { Treatments } from '../api/treatments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {

  private apiUrl = "http://localhost:8085/api/v1/admin/treatments";  

  constructor(private http:HttpClient,
    private headerService : HeaderService) { }
  
  createTreatments(treatments: Treatments):Observable<Treatments>{
    return this.http.post<Treatments>(this.apiUrl, treatments,{headers:this.headerService.headers});
  }

  updateTreatments(id: number, treatments: Treatments): Observable<Treatments> {
    return this.http.put<Treatments>(`${this.apiUrl}/${id}`, treatments,{headers:this.headerService.headers});
  }

  getTreatmentslist():Observable<Treatments[]>{
    return this.http.get<Treatments[]>(this.apiUrl,{headers:this.headerService.headers});
  }
  getTreatmentsById(id:number):Observable<Treatments>{
    return this.http.get<Treatments>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deleteTreatmentsId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  deleteSelectedTreatments(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
  }
}
