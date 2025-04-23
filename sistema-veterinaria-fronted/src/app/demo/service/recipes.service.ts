import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipes } from '../api/recipes';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private apiUrl = "http://localhost:8085/api/v1/admin/recipes";  

  constructor(private http:HttpClient,
    private headerService : HeaderService) { }
  
  createRecipes(recipes: Recipes):Observable<Recipes>{
    return this.http.post<Recipes>(this.apiUrl, recipes,{headers:this.headerService.headers});
  }

  updateRecipes(id: number, recipes: Recipes): Observable<Recipes> {
    return this.http.put<Recipes>(`${this.apiUrl}/${id}`, recipes,{headers:this.headerService.headers});
  }

  getRecipeslist():Observable<Recipes[]>{
    return this.http.get<Recipes[]>(this.apiUrl,{headers:this.headerService.headers});
  }
  getRecipesById(id:number):Observable<Recipes>{
    return this.http.get<Recipes>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deleteRecipesId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  downloadPdf(id: number): Observable<Blob> {
    // Agregar los headers desde headerService
    const headers = this.headerService.headers;  

    return this.http.get(`http://localhost:8085/api/v1/admin/recipes/${id}/pdf`, {
      headers: headers,  
      responseType: 'blob'  
    });
  }

deleteSelectedRecipes(ids: number[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
}

}  


