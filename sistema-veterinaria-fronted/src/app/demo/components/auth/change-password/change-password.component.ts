import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { ChangePaswordDto } from 'src/app/demo/api/change-pasword-dto';
import { EmailPasswordService } from 'src/app/demo/service/email-password.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,
            ToastModule,
            FormsModule,
            ReactiveFormsModule,
            PasswordModule,
            
            ButtonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  providers: [MessageService]

})
export class ChangePasswordComponent {

  password: string = '';
  confirmPassword: string = '';
  tokenPassword: string = '';
  dto!: ChangePaswordDto;
  formchangepassword!: FormGroup
  

  constructor(
    private emailservice: EmailPasswordService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formchangepassword = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // Al menos 8 caracteres
          Validators.pattern('[a-zA-Z0-9]*'), // Debe contener solo letras y números
          this.passwordStrengthValidator // Validador personalizado para comprobar la fuerza de la contraseña
        ]
      ],
      confirmPassword: [
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

  onChangePassword() {
    // Verificar si el formulario es inválido
    if (this.formchangepassword.invalid) {
      // Mostrar un error por cada campo inválido
      const passwordControl = this.formchangepassword.get('password');
      const confirmPasswordControl = this.formchangepassword.get('confirmPassword');
  
      if (passwordControl?.invalid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.passwordErrors,
        });
  
        return;
      }
  
      if (confirmPasswordControl?.invalid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.passwordErrors,
        });
  
        return;
      }
  
      return;
    }
  
    if (this.formchangepassword.value.password !== this.formchangepassword.value.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden',
      });
      return;
    }
  
    this.tokenPassword = this.activatedRoute.snapshot.params['tokenPassword'];
    
    // Crear un objeto que cumpla con la interfaz ChangePaswordDto
    const dto: ChangePaswordDto = {
      password: this.formchangepassword.value.password,
      confirmPassword: this.formchangepassword.value.confirmPassword,
      tokenPassword: this.tokenPassword
    };
  
    this.emailservice.changePassword(dto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Contraseña actualizada',
        });
        this.router.navigate(['auth/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error,
        });
      }
    });
  }

  get passwordErrors() {
    const passwordControl = this.formchangepassword.get('password');
    const confirmPasswordControl = this.formchangepassword.get('confirmPassword');

    // Validación de la contraseña
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

    // Validación de la confirmación de la contraseña
    if (confirmPasswordControl?.hasError('required')) {
      return 'La confirmación de la contraseña es obligatoria.';
    }
    if (confirmPasswordControl?.value !== passwordControl?.value) {
      return 'Las contraseñas no coinciden.';
    }

    return '';
  }

}
