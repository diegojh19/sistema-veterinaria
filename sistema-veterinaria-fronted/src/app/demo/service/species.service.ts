import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Species } from '../api/species';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {

  private apiUrl = "http://localhost:8085/api/v1/admin/species";  

  constructor(private http:HttpClient,
    private headerService : HeaderService
  ) { }

  createSpecies(species:Species):Observable<Species>{
    return this.http.post<Species>(this.apiUrl, species,{headers:this.headerService.headers});
  }
  updateSpecies(id: number, species: Species): Observable<Species> {
    return this.http.put<Species>(`${this.apiUrl}/${id}`, species,{headers:this.headerService.headers});
  }
  getSpecieslist():Observable<Species[]>{
    return this.http.get<Species[]>(this.apiUrl, {headers:this.headerService.headers});
  }
  getSpeciesById(id:number):Observable<Species>{
    return this.http.get<Species>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deleteSpeciesId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  deleteSelectedSpecies(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids, {headers:this.headerService.headers}); 
  }
}
