import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../api/user';
import { JwtClient } from '../api/jwt-client';
import { Userdto } from '../api/userdto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = "http://localhost:8085/api/v1/security";

  constructor(private http:HttpClient) { }

  register(user:User):Observable<User>{
    return this.http.post<User>(this.apiUrl+"/register",user);
  }

  login(userDto:Userdto):Observable<JwtClient>{
    return this.http.post<JwtClient>(this.apiUrl+"/login", userDto);
  }
}
