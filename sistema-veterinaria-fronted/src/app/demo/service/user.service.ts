import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../api/user';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = "http://localhost:8085/api/v1/admin/users";  

  constructor(private http:HttpClient,
    private headerService : HeaderService) { }

  createUsers(user:User):Observable<User>{
    return this.http.post<User>(this.apiUrl, user,{headers:this.headerService.headers});
  }
  updateUsers(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user,{headers:this.headerService.headers});
  }
  getUserlist():Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl,{headers:this.headerService.headers});
  }
  getUserById(id:number):Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});
  }

  deleteUserId(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headerService.headers});       
  }

  deleteSelectedUser(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, ids,{headers:this.headerService.headers}); 
  }

  verifyEmail(token: string): Observable<any> {
    const url = `${this.apiUrl}/verify`;
    const params = new HttpParams().set('token', token);
    return this.http.get<any>(url, { params });
  }
  
}
