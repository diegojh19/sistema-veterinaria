import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diagnosis } from '../api/diagnosis';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {

  private apiUrl = "http://localhost:8085/api/v1/admin/diagnosis";  

  constructor(private http:HttpClient,
    private headerService : HeaderService) { }
  
  createDiagnosis(diagnosis: Diagnosis):Observable<Diagnosis>{
    return this.http.post<Diagnosis>(this.apiUrl, diagnosis,{headers:this.headerService.headers});
  }

  updateDiagnosis(id: number, diagnosis: Diagnosis): Observable<Diagnosis> {
    return this.http.put<Diagnosis>(`${this.apiUrl}/${id}`, diagnosis,{headers:this.headerService.headers});
  }

  getDiagnosislist():Observable<Diagnosis[]>{
    return this.http.get<Diagnosis[]>(this.apiUrl,{headers:this.headerService.headers});
  }
  getDiagnosisById(id:number):Observable<Diagnosis>{
    return this.http.get<Diagnosis>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deleteDiagnosisId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  deleteSelectedDiagnosis(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
  }
}
