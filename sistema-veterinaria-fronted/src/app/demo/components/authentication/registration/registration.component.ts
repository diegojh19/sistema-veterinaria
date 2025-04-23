import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { User } from 'src/app/demo/api/user';
import { UserType } from 'src/app/demo/api/user-type';
import { AuthenticationService } from 'src/app/demo/service/authentication.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        TooltipModule,
        RippleModule,
        RouterModule,
        ReactiveFormsModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  providers: [MessageService]
})
export class RegistrationComponent {

  username : string ='';
  firstName : string ='';
  lastName : string = '';
  email : string = '';
  address : string = '';
  cellphone : string ='';
  password : string = '';
  usertype : string = '';

  registerDialog: boolean = false;

  formregister!: FormGroup;

  constructor(
    private fb:FormBuilder,
    private authetication : AuthenticationService,
     private messageService: MessageService,
    private router : Router

  ){}

  ngOnInit(): void {
      // this.specie = [];  // Asegúrate de que sea un arreglo vacío
      this.formregister = this.fb.group({
        id: [null],
        username: ['', [Validators.required,Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ]{1,254}')]],
        firstName: ['', [Validators.required,Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ]{1,254}')]],
        lastName: ['', [Validators.required,Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ]{1,254}')]],            
        email: ['', [Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,254}')]],
        address: ['', [Validators.required]], // Para dirección
        cellphone: [
          '', 
          [
              Validators.required, 
              Validators.pattern(/^[0-9]{10}$/)
// Solo permite exactamente 10 dígitos // Asegura que solo números sean permitidos
              
          ]
      ],
        password: [
          '', 
          [
            Validators.required, 
            Validators.minLength(8), // Al menos 8 caracteres
            Validators.pattern('[a-zA-Z0-9]*'), // Debe contener solo letras y números
            this.passwordStrengthValidator // Validador personalizado para comprobar la fuerza de la contraseña
          ]
        ]
});

  }

// Variable para controlar el tipo de campo (password o text)
passwordFieldType: string = 'password';

// Función para alternar la visibilidad de la contraseña
togglePasswordVisibility(): void {
  // Alternar entre 'password' y 'text'
  this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
}

  openNew() {
    
    this.registerDialog = true;
  }

  hideDialog() {
    this.registerDialog = false;
    
  }

  passwordStrengthValidator(control: any) {
    if (!control.value) return null;

    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasMinLength = value.length >= 8;

    if (hasUpperCase && hasLowerCase && hasNumbers && hasMinLength) {
      return null; // La contraseña es válida
    }

    return { passwordStrength: true }; // Contraseña no cumple los requisitos
  }

  saveRegister() {
    // Verificar si el formulario es válido antes de continuar
    if (this.formregister.invalid) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario Incompleto',
        detail: 'Por favor, complete correctamente todos los campos del formulario',
        life: 3000
      });
      return;
    }
  
    this.username = this.formregister.value.email;
    this.usertype = UserType.ADMIN;
  
    // Imprimir los valores del formulario antes de crear el objeto user
    console.log('Formulario:', this.formregister.value);
    
    let user: User = {
     
      username: this.username,
      firstName: this.formregister.value.firstName,
      lastName: this.formregister.value.lastName,
      email: this.formregister.value.email,
      address: this.formregister.value.address,
      cellphone: this.formregister.value.cellphone,
      password: this.formregister.value.password,
      userType: this.usertype
    }; 
    
    this.authetication.register(user).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registro Guardado Correctamente',
          life: 3000
        });

        setTimeout(() => {
          this.router.navigate(['uikit/users']);
        }, 1000);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar el registro:', error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Hubo un error al guardar el registro',
          life: 3000
        });
      }
    });
    
  }
  

  // Función para comprobar si el campo de la contraseña tiene un error específico
  get passwordErrors() {
    const passwordControl = this.formregister.get('password');
    if (passwordControl?.hasError('required')) {
      return 'La contraseña es obligatoria.';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (passwordControl?.hasError('pattern')) {
      return 'La contraseña debe contener solo letras y números.';
    }
    if (passwordControl?.hasError('passwordStrength')) {
      return 'La contraseña debe tener al menos una letra mayúscula, una letra minúscula y un número.';
    }
    return '';
  }

}
