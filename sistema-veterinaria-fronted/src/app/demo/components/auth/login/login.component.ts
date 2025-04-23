
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { Userdto } from 'src/app/demo/api/userdto';
import { AuthenticationService } from 'src/app/demo/service/authentication.service';
import { SessionStorageService } from 'src/app/demo/service/session-storage.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
     standalone: true,
     imports: [
        CommonModule,
        ToastModule,
        FormsModule,
        ReactiveFormsModule,
        PasswordModule,
        ButtonModule,
        RouterModule
            
           ],
     templateUrl: './login.component.html',
     
     providers: [MessageService]
})
export class LoginComponent {

    username : string = '';
    password : string = '';
    formlogin!: FormGroup;

  constructor(
    private authentication : AuthenticationService,
    private sessionStorage : SessionStorageService,
    private router : Router,
    public layoutService: LayoutService,
    private messageService: MessageService,
    private fb: FormBuilder  // Inyectamos FormBuilder
    
  ){}
  
  ngOnInit(): void {
    this.formlogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  
  login() {
    if (this.formlogin.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario Incompleto',
        detail: 'Por favor, complete correctamente todos los campos del formulario',
        life: 3000
      });
      return;
    }
  
    const userDto: Userdto = {
      username: this.formlogin.value.username,
      password: this.formlogin.value.password
    };
  
    this.authentication.login(userDto).subscribe(
      token => {
        console.log("Token recibido:", token); // Verifica la respuesta del servidor
        this.sessionStorage.setItem('token', token);
      
        if (token.type == 'ADMIN') {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/']);
        }
      },
      (err: HttpErrorResponse) => {
        // Aquí capturamos el mensaje de error que el backend devuelve
        const errorMessage = err.error ? err.error.message : 'Hubo un error al intentar iniciar sesión';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 3000
        });
        console.error('Error en la autenticación:', err);  // Agrega más detalles del error
      }
    );
}

     
}
