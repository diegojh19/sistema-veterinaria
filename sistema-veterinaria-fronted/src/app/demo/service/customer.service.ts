import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../api/customer';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = "http://localhost:8085/api/v1/admin/customers";  

  constructor(private http:HttpClient,
    private headerService : HeaderService) { }
  
  createCustomer(formData:any):Observable<any>{
    return this.http.post<Customer>(this.apiUrl, formData,{headers:this.headerService.headers});
  }

  updateCustomer(id: number, formData:any): Observable<any> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, formData,{headers:this.headerService.headers});
  }

  getCustomerlist():Observable<Customer[]>{
    return this.http.get<Customer[]>(this.apiUrl,{headers:this.headerService.headers});
  }
  getCustomerById(id:number):Observable<Customer>{
    return this.http.get<Customer>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deleteCustomerId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  deleteSelectedCustomers(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
  }
}
