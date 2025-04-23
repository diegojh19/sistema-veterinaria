import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { EmailValuesDto } from 'src/app/demo/api/email-values-dto';
import { EmailPasswordService } from 'src/app/demo/service/email-password.service';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [CommonModule,
          ToastModule,
          FormsModule,
          ReactiveFormsModule,
          
          ButtonModule
        ],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.scss',
  providers: [MessageService]
})
export class SendEmailComponent {

  mailTo: string= '';
  dto: EmailValuesDto = {} as EmailValuesDto;
  formsendemail!: FormGroup;
  isSending: boolean = false;


  constructor(
    private emailPassword: EmailPasswordService,
    private messageService: MessageService,
    private fb: FormBuilder  // Inyectamos FormBuilder


  ){}

  ngOnInit(): void {
    this.formsendemail = this.fb.group({
      mailTo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,254}')]], // Validación del email
    });
  }

  onSendEmail() {

    if (this.formsendemail.invalid) {
      const mailToControl = this.formsendemail.get('mailTo');
  
      if (mailToControl?.hasError('required')) {

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El Correo Electrónico Es Obligatorio',
      });
        
      }
      // Verificamos si el campo tiene un error de 'pattern' (correo no válido)
      else if (mailToControl?.hasError('pattern')) {

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El correo electrónico no es válido',
      });
        
      }
      return;
    }
   
  
     // Crear el objeto DTO sin usar 'new'
     this.dto = { mailTo: this.formsendemail.get('mailTo')?.value }; // Usamos el valor del formulario
     console.log('DTO creado: ', this.dto);
  
    this.emailPassword.sendEmail(this.dto).subscribe({
      next:()=>{
        this.messageService.add({
          severity: 'Éxito',
          summary: 'Éxito',
          detail: 'Revisa tu bandeja de entrada para restablecer la contraseña',
      });
        this.formsendemail.reset(); // Resetea el formulario
      },
      error:(error: HttpErrorResponse)=>{
        if (error.status === 404 && error.error.message.includes('no existe')) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El correo no existe o no es válido',
        });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un problema al enviar el correo',
        });
        }
      }
    }
    );
  }

}
