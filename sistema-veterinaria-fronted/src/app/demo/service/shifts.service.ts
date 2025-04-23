import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shifts } from '../api/shifts';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  private apiUrl = "http://localhost:8085/api/v1/admin/shifts";  

  constructor(private http:HttpClient,
    private headerService : HeaderService) { }
  
  createShifts(shifts: Shifts):Observable<Shifts>{
    return this.http.post<Shifts>(this.apiUrl, shifts,{headers:this.headerService.headers});
  }

  updateShifts(id: number, shifts: Shifts): Observable<Shifts> {
    return this.http.put<Shifts>(`${this.apiUrl}/${id}`, shifts,{headers:this.headerService.headers});
  }

  getShiftslist():Observable<Shifts[]>{
    return this.http.get<Shifts[]>(this.apiUrl,{headers:this.headerService.headers});
  }
  getShiftsById(id:number):Observable<Shifts>{
    return this.http.get<Shifts>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deleteShiftsId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  deleteSelectedShifts(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
  }
}
