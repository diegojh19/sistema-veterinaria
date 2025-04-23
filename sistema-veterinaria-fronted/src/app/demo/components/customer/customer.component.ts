import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Customer } from '../../api/customer';
import { CustomerService } from '../../service/customer.service';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    TooltipModule,
    RippleModule,
    RouterModule,
    ReactiveFormsModule,

  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
  providers: [MessageService]
})
export class CustomerComponent {

  customers: Customer[] = [];

  customer: Customer = {};

  selectedCustomer: Customer[] = [];

  //Abrir el formulario 
  customersDialog: boolean = false;

  isEditing: boolean = false;

  submitted: boolean = false;

  deleteCustomersDialog: boolean = false;

  deleteCustomerDialog: boolean = false;

  formcustomer!: FormGroup;

  id: number = 0;
  name_customer: string = "";
  surname_customer: string = "";
  photo_customer: string = "";
  citizenship_card: string = "";
  cellphone_customer: string = "";
  address: string = "";
  city: string = "";
  email_customer: string = "";

  selectFile: File | null = null;     // Archivo seleccionado
  imagePreview: string | ArrayBuffer | null = null; // Para mostrar la vista previa de la imagen seleccionada

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.listCustomer();  // Llamar al servicio para obtener la lista 

    this.formcustomer = this.fb.group({
      id: [''],
      name_customer: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      surname_customer: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]], // Apellido obligatorio
      email_customer: ['', [Validators.required, Validators.email]],  // Correo obligatorio y válido
      cellphone_customer: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', [Validators.required]],  // Dirección obligatoria
      city: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      citizenship_card: ['', [Validators.required, Validators.pattern(/^\d{8,10}$/)]],
      photo_customer: [''],
    });
  }

  openNew() {
    this.customer = {};
    this.isEditing = false; // Establecer que no es edición
    this.submitted = false;
    this.formcustomer.reset(); //
    this.customersDialog = true;
  }

  resetDialog() {
    this.selectFile = undefined;
    this.imagePreview = null;
    this.customer = {}; // Resetea el objeto cliente para evitar datos residuales
    this.submitted = false;
  }

  hideDialog() {
    this.customersDialog = false;
    this.resetDialog(); // Llama al método de limpieza
  }

  editCustomer(customer: Customer) {
    this.customer = { ...customer }; // Clonar los datos del cliente seleccionado
    console.log('Cliente para editar:', this.customer);

    this.formcustomer.patchValue(this.customer); // Asigna los valores al formulario

    // Si el cliente tiene una imagen, asignarla a imagePreview
    this.imagePreview = this.customer.photo_customer || null;

    this.isEditing = true;
    this.customersDialog = true;
  }


  listCustomer() {
    this.customerService.getCustomerlist().subscribe({
      next: (res) => {
        this.customers = res;
        console.log("customer", this.customers);
      },
      error: (e) => {
        console.error(e);
      }
    });

  }

  saveCustomer() {
    this.submitted = true;

    // Forzar que todos los campos del formulario se marquen como "tocados" y "sucios"
    if (this.formcustomer.invalid) {
      Object.values(this.formcustomer.controls).forEach(control => {
        control.markAsTouched();
        control.markAsDirty();
      });
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete correctamente todos los campos del formulario',
        life: 3000  // Duración del mensaje
      });

      return;
    }

    const formData = new FormData();
    formData.append('id', this.formcustomer.value.id?.toString() || '0');
    formData.append('name_customer', this.formcustomer.value.name_customer);
    formData.append('surname_customer', this.formcustomer.value.surname_customer);
    formData.append('photo_customer', this.formcustomer.value.photo_customer);
    formData.append('citizenship_card', this.formcustomer.value.citizenship_card);
    formData.append('cellphone_customer', this.formcustomer.value.cellphone_customer);
    formData.append('address', this.formcustomer.value.address);
    formData.append('city', this.formcustomer.value.city);
    formData.append('email_customer', this.formcustomer.value.email_customer);
    if (this.selectFile) {
      formData.append('image', this.selectFile || '');
    }

    if (this.isEditing) {
      // Edición
      this.customerService.updateCustomer(this.customer.id, formData).subscribe({
        next: (updatedCustomer) => {
          const index = this.customers.findIndex(c => c.id === updatedCustomer.id);
          if (index !== -1) {
            this.customers[index] = updatedCustomer;
          }
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado correctamente' });
          this.hideDialog();
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el cliente' });
        }
      });
    } else {
      // Creación
      this.customerService.createCustomer(formData).subscribe({
        next: (newCustomer) => {
          this.customers.push(newCustomer);
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: 'Cliente creado correctamente' });

            this.listCustomer();

            // Cerrar el diálogo y limpiar el formulario
            this.customersDialog = false;
            this.customer = {}; // Limpiar formulario 
  
        },
        error: (e) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo crear el cliente' });
        }
      });
    }
  }


  // Mostrar el cuadro de diálogo de eliminación
  deleteCustomer(customers: Customer) {
    this.customer = { ...customers };
    this.deleteCustomersDialog = true; // Abrir el cuadro de diálogo
  }

  confirmDelete() {
    if (!this.customer.id) return;
    // Llamar al servicio para eliminar 
    this.customerService.deleteCustomerId(this.customer.id).subscribe({
      next: () => {

        // Eliminar de la lista 
        this.customers = this.customers.filter(c => c.id !== this.customer.id);

        // this.customer.photo_customer = updatedCustomer.photo_customer;
        // Si estás utilizando una tabla, también puedes hacer esto para actualizar el estado de la tabla:
        this.customers = [...this.customers]; // Esto forzará la actualización de la tabla


        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cliente Eliminado',
          life: 3000
        });

        // Limpiar el objeto de cliente
        this.customer = {};

        // Cerrar el cuadro de diálogo de eliminación
        this.deleteCustomersDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar El Cliente',
          life: 3000
        });
        console.error(e);
      }
    });
  }

  // Método para manejar la selección de archivo de imagen
  onFileSelect(event: any): void {
    this.selectFile = event.target.files[0];

    // Mostrar vista previa de la imagen seleccionada
    if (this.selectFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Asigna la imagen al campo imagePreview
      };
      reader.readAsDataURL(this.selectFile); // Lee el archivo como URL
    }
  }

  removeImage(): void {
    this.selectFile = null;       // Elimina el archivo seleccionado
    this.imagePreview = null;     // Limpia la vista previa
    this.customer.photo_customer = null; // Restablece el valor del modelo asociado
  }

  onGlobalFilter(dt: any, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    dt.filterGlobal(value, 'contains');
  }

  // Método para eliminar
  deleteSelectedCustomers() {
    if (this.selectedCustomer.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione los clientes que desea eliminar.',
        life: 3000
      });
      return;
    }
    this.deleteCustomerDialog = true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación 
  confirmDeleteSelected() {
    const selectedIds = this.selectedCustomer.map(species => species.id);

    // Llamar al servicio para eliminar 
    this.customerService.deleteSelectedCustomers(selectedIds).subscribe({
      next: () => {
        // Eliminar 
        this.customers = this.customers.filter(customers => !this.selectedCustomer.includes(customers));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Clientes Eliminados Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedCustomer = [];
        this.deleteCustomerDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar los clientes seleccionados.',
          life: 3000
        });
        console.error(e);
      }
    });
  }

}
