import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../api/products';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = "http://localhost:8085/api/v1/admin/products";  

  constructor(private http:HttpClient,
    private headerService : HeaderService) { }

  createProduct(formData:any):Observable<any>{
    return this.http.post<Products>(this.apiUrl, formData,{headers:this.headerService.headers});
  }

  updateProduct(id: number, product: Products): Observable<Products> {
    return this.http.put<Products>(`${this.apiUrl}/${id}`, product,{headers:this.headerService.headers});
  }
  
  getProductslist():Observable<Products[]>{
    return this.http.get<Products[]>(this.apiUrl,{headers:this.headerService.headers});
  }

  getProductById(id:number):Observable<Products>{
    return this.http.get<Products>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }
  
  deleteProductById(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers}); 
  }

  deleteSelectedProducts(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
  }
}


  

 
  
  

  

  