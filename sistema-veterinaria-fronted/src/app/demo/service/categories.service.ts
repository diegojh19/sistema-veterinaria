import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categories } from '../api/categories';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = "http://localhost:8085/api/v1/admin/categories";  

  constructor(private http:HttpClient,
    private headerService : HeaderService) { }
  
  createCategories(categories: Categories):Observable<Categories>{
    return this.http.post<Categories>(this.apiUrl, categories,{headers:this.headerService.headers});
  }

  updateCategories(id: number, categories: Categories): Observable<Categories> {
    return this.http.put<Categories>(`${this.apiUrl}/${id}`, categories,{headers:this.headerService.headers});
  }

  getCategorieslist():Observable<Categories[]>{
    return this.http.get<Categories[]>(this.apiUrl,{headers:this.headerService.headers});
  }
  getCategoriesById(id:number):Observable<Categories>{
    return this.http.get<Categories>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deleteCategoriesId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  deleteSelectedCategories(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
  }
}
