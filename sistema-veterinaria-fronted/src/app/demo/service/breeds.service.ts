import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Breeds } from '../api/breeds';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class BreedsService {

  private apiUrl = "http://localhost:8085/api/v1/admin/breeds";  

  constructor(private http:HttpClient,
      private headerService : HeaderService) { }
  
  createBreeds(breeds: Breeds):Observable<Breeds>{
    return this.http.post<Breeds>(this.apiUrl, breeds,{headers:this.headerService.headers});
  }

  updateBreeds(id: number, breeds: Breeds): Observable<Breeds> {
    return this.http.put<Breeds>(`${this.apiUrl}/${id}`, breeds,{headers:this.headerService.headers});
  }

  getBreedslist():Observable<Breeds[]>{
    return this.http.get<Breeds[]>(this.apiUrl,{headers:this.headerService.headers});
  }
  getBreedsById(id:number):Observable<Breeds>{
    return this.http.get<Breeds>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deleteBreedsId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  deleteSelectedBreeds(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
  }

}
