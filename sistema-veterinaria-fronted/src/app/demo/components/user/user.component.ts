import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { UserService } from '../../service/user.service';
import { User } from '../../api/user';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { UserType } from '../../api/user-type';

@Component({
  selector: 'app-user',
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
    DropdownModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [MessageService]
})
export class UserComponent {

  //Abrir Formulario
  usersDialog: boolean = false;

  isEditing: boolean = false;

  submitted: boolean = false;

  users: User[] = [];

  user: User = {};

  formsusers!: FormGroup;

  selectedUser: User[] = [];

  deleteusersDialog: boolean = false;

  deleteuserDialog: boolean = false;

  message: string = '';
  token: string | null = '';

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder

  ) { }

  ngOnInit(): void {

      this.token = this.route.snapshot.queryParamMap.get('token');
      console.log('token->',this.token); // Verifica si el token se está obteniendo correctamente
      if (this.token) {
        this.verifyEmail(this.token);
      } else {
        this.message = 'Token no proporcionado.';
      }
    

    this.listUser();  // Llamar al servicio para obtener la lista 

    // Inicializar el formulario con validaciones
    this.formsusers = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
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
            ],

            userType: ['ADMIN', [Validators.required]] // Rol fijo, predeterminado como "Administrador"
    });

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

  // Función para comprobar si el campo de la contraseña tiene un error específico
  get passwordErrors() {
    const passwordControl = this.formsusers.get('password');
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

  
  openNew() {
    this.user = {};
    this.isEditing = false; // Establecer que no es edición
    this.submitted = false;
    this.formsusers.reset(); //
    this.usersDialog = true;
  }

  hideDialog() {
    this.usersDialog = false;
    this.submitted = false;
  }

  listUser() {
    this.userService.getUserlist().subscribe({
      next: (res) => {
        this.users = res;
        console.log("aqui", this.user);
      },
      error: (e) => {
        console.error(e);
      }
    });

  }

  editUsers(users: User) {
    this.user = { ...users };  
    this.isEditing = true; 
    this.usersDialog = true;  
  
    // Actualizar el formulario con los datos de la categoría seleccionada
    this.formsusers.patchValue({
      username: this.user.username,
      lastName: this.user.lastName,
      email: this.user.email,
      address: this.user.address,
      cellphone: this.user.cellphone,
      password: this.user.password,
      userType: this.user.userType,
      
      
    });
    if (this.isEditing) {
      this.formsusers.get('password')?.clearValidators();
    }
    this.formsusers.get('password')?.updateValueAndValidity();
  }
  

  saveUsers() {
    this.submitted = true;

    // Verificar si el formulario es válido antes de continuar
    if (this.formsusers.invalid) {
      this.messageService.clear();  // Limpiar cualquier toast anterior
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario Incompleto',
        detail: 'Por favor, complete correctamente todos los campos del formulario',
        life: 3000  // Duración del mensaje
      });
      return;
    }

     // Asignar los valores del formulario a this.user
     this.user = { ...this.user, ...this.formsusers.value }; // Preserva el ID del usuario anterior

  // **Imprimir los datos que se van a modificar antes de enviarlos**
  console.log("Datos antes de enviar al servidor:", this.user);


    if (this.user.id) {
      this.userService.updateUsers(this.user.id, this.user).subscribe({
        next: (updatedUsers) => {
          const index = this.users.findIndex((s) => s.id === updatedUsers.id);
          if (index !== -1) {
            this.users[index] = updatedUsers;
          }

          // Mostrar mensaje de éxito
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario Actualizado Correctamente',
            life: 3000  // Duración del mensaje
          });

          this.listUser();
          this.usersDialog = false;
          this.user = {};
        },
        error: (e) => {
          console.error('Error Al Actualizar El Usuario', e);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo Un Error Al Actualizar El Usuario',
            life: 3000  // Duración del mensaje
          });
        },
      });
    } else {
      // Crear nueva especie
      this.userService.createUsers(this.user).subscribe({
        next: (res) => {
          this.users.push(res);
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario Guardado Correctamente',
            life: 3000  // Duración del mensaje
          });

          this.listUser();
          this.usersDialog = false;
          this.user = {};
        },
        error: (e) => {
          console.error('Error Al Guardar El Usuario', e);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo Un Error Al Guardar El Usuario',
            life: 3000  // Duración del mensaje
          });
        },
      });
    }
  }

  deleteUsers(user: User) {
    this.user = { ...user };  
    this.deleteusersDialog = true; 
  }

  confirmDelete() {
    // Llamar al servicio para eliminar
    this.userService.deleteUserId(this.user.id).subscribe({
      next: () => {
        // Eliminar de la lista 
        this.users = this.users.filter(user => user.id !== this.user.id);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario Eliminado',
          life: 3000
        });

        // Limpiar el objeto 
        this.user = {};

        // Cerrar el cuadro de diálogo de eliminación
        this.deleteusersDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar El Usuario',
          life: 3000
        });
        console.error(e);
      }
    });
  }

  
   // Método para eliminar
   deleteSelectedUsers() {
    if (this.selectedUser.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione los usuarios que desea eliminar.',
        life: 3000
      });
      return;
    }
    this.deleteuserDialog = true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación 
  confirmDeleteSelected() {
    const selectedIds = this.selectedUser.map(species => species.id);

    // Llamar al servicio para eliminar 
    this.userService.deleteSelectedUser(selectedIds).subscribe({
      next: () => {
        // Eliminar 
        this.users = this.users.filter(users => !this.selectedUser.includes(users));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuarios Eliminados Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedUser = [];
        this.deleteuserDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar los usuarios seleccionados.',
          life: 3000
        });
        console.error(e);
      }
    });
  }

   // Llamada al servicio para verificar el token
   verifyEmail(token: string): void {
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
