import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patients } from '../api/patients';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  private apiUrl = "http://localhost:8085/api/v1/admin/patients";  

  constructor(private http:HttpClient,
    private headerService : HeaderService
  ) { }
  
  createPatients(formData:any):Observable<any>{
    return this.http.post<Patients>(this.apiUrl, formData,{headers:this.headerService.headers});
  }

  updatePatients(id: number, formData:any): Observable<any> {
    return this.http.put<Patients>(`${this.apiUrl}/${id}`, formData,{headers:this.headerService.headers});
  }

  getPatientslist():Observable<Patients[]>{
    return this.http.get<Patients[]>(this.apiUrl,{headers:this.headerService.headers});
  }
  getPatientsById(id:number):Observable<Patients>{
    return this.http.get<Patients>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deletePatientsId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  deleteSelectedPatients(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
  }
}
