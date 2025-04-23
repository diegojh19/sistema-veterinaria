import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePaswordDto } from '../api/change-pasword-dto';
import { EmailValuesDto } from '../api/email-values-dto';

@Injectable({
  providedIn: 'root'
})
export class EmailPasswordService {

  private apiUrl = "http://localhost:8085/email-password";  

  constructor(private http:HttpClient) { }
  sendEmail(dto: EmailValuesDto):Observable<any>{
    return this.http.post<any>(this.apiUrl+"/send-email",dto);
  }

  changePassword(dto: ChangePaswordDto):Observable<any>{
    return this.http.post<any>(this.apiUrl+"/change-password",dto);
  }
}
