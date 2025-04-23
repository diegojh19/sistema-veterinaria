import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.scss'
})
export class VerificationComponent {

  message: string = '';
  token: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log('aqui',this.token); // Verifica si el token se está obteniendo correctamente
    if (this.token) {
      this.verifyEmail();
    } else {
      this.message = 'Token no proporcionado.';
    }
  }

  // Llamada al servicio para verificar el token
  verifyEmail(): void {
    if (this.token) {
      this.userService.verifyEmail(this.token).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          this.message = response.message;  // Mensaje de éxito
        },
        error: (err) => {
         // console.error('Error al verificar correo:', err);
          if (err.status === 400 && err.error.message === 'Token expirado') {
            this.message = 'El token de verificación ha expirado. Por favor, solicita uno nuevo.';
            // Mostrar un botón o enlace para reenviar el correo de verificación
            //this.showResendButton = true;  // Habilitar opción de reenvío de token
          } else {
            this.message = err.error?.message || 'Hubo un error al verificar el correo.';
          }
        }
      });
    }
  }

}
