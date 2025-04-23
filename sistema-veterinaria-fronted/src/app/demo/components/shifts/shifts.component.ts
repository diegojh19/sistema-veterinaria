import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Shifts } from '../../api/shifts';
import { ShiftsService } from '../../service/shifts.service';
import { Customer } from '../../api/customer';
import { CustomerService } from '../../service/customer.service';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.scss',
  providers: [MessageService]


})
export class ShiftsComponent {

  shifts: Shifts[] = [];

  shift: Shifts = {};

  selectedShifts: Shifts[] = [];

  customer: Customer[] = [];

  //Abrir el formulario 
  shiftsDialog: boolean = false;

  isEditing: boolean = false;

  submitted: boolean = false;

  deleteshiftsDialog: boolean = false;

  deleteshiftDialog: boolean = false;

  formsshifts!: FormGroup;
  
  constructor(
    private shiftsService:ShiftsService,
    private customerService:CustomerService,
    private messageService: MessageService,
    private fb: FormBuilder

  ){}

  ngOnInit(): void {
    this.listShifts();  // Llamar al servicio para obtener la lista 
    this.getCustomer();

    // Inicializar el formulario con validaciones
    this.formsshifts = this.fb.group({
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      customer_idcustomer: ['', Validators.required],
    });
  }

  openNew() {
    this.shift = {};
    this.isEditing = false; // Establecer que no es edición
    this.submitted = false;
    this.formsshifts.reset(); //
    this.shiftsDialog = true;
  }

  hideDialog() {
    this.shiftsDialog = false;
    this.submitted = false;
  }


  listShifts() {
    this.shiftsService.getShiftslist().subscribe({
      next: (res) => {
        this.shifts = res;
        console.log("shifts", this.listShifts);
      },
      error: (e) => {
        console.error(e);
      }
    });

  }

  getCustomer() {
    this.customerService.getCustomerlist().subscribe({
      next: (data) => {
        console.log('Datos obtenidos de customer:', data);
        this.customer = data;
      },
      error: (e) => {
        console.error('Error al obtener customer:', e);
      },
    });
  }

  getCustomerName(customer_idcustomer: number): string {
    const customers = this.customer.find(s => s.id === customer_idcustomer);  
    return customers ? customers.name_customer : 'N/A'; // Devuelve 'N/A' si no se encuentra 
  }

  getSelectedCustomerName(): string {
    const selectedcustomer = this.customer.find(customers => customers.id === this.shift.customer_idcustomer);
    return selectedcustomer ? selectedcustomer.name_customer : '';
  }

  editShifts(shifts: Shifts) {
    console.log('Editando turno:', shifts); // Verifica los datos recibidos

    this.shift = { ...shifts }; // Copia los datos correctamente

    // Asegúrate de que el ID existe antes de editar
    if (!this.shift.id) {
        console.error('Error: No se encontró ID para el turno a editar.');
        return;
    }

    // Formatear fechas para que sean compatibles con inputs de tipo 'date'
    this.shift.start = this.formatDate(this.shift.start);
    this.shift.end = this.formatDate(this.shift.end);

    this.isEditing = true;
    this.shiftsDialog = true; // Abre el modal de edición

    this.formsshifts.patchValue({
        id: this.shift.id, // Asegurar que el ID se incluya en el formulario
        start: this.shift.start,
        end: this.shift.end,
        title: this.shift.title,
        customer_idcustomer: this.shift.customer_idcustomer
    });
}



// Función para formatear la fecha al formato yyyy-MM-dd.
formatDate(date: string | Date | undefined): string | undefined {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}


saveShifts() {
  this.submitted = true;

  if (this.formsshifts.invalid) {
      this.messageService.clear();
      this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Por favor, complete todos los campos correctamente',
          life: 3000  // Duración del mensaje
      });
      return;
  }

  console.log('Datos antes de guardar:', this.formsshifts.value);

  this.shift = {
      ...this.shift,
      ...this.formsshifts.value,
      start: this.formsshifts.value.start ? new Date(this.formsshifts.value.start).toISOString().split('T')[0] : '',
      end: this.formsshifts.value.end ? new Date(this.formsshifts.value.end).toISOString().split('T')[0] : ''
  };

  if (this.shift.id) {
      // Actualizar un turno existente
      this.shiftsService.updateShifts(this.shift.id, this.shift).subscribe({
          next: (updatedShifts) => {
              console.log('Turno actualizado:', updatedShifts);

              const index = this.shifts.findIndex((s) => s.id === updatedShifts.id);
              if (index !== -1) {
                  this.shifts[index] = updatedShifts;
              }

              this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Turno actualizado correctamente',
              });

              this.listShifts();
              this.shiftsDialog = false;
              this.shift = {};
          },
          error: (e) => {
              console.error('Error al actualizar el turno:', e);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Hubo un error al actualizar el turno',
              });
          },
      });
  } else {
      // Crear un nuevo turno (POST)
      this.shiftsService.createShifts(this.shift).subscribe({
          next: (newShift) => {
              console.log('Nuevo turno creado:', newShift);
              this.shifts.push(newShift);

              this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Turno creado correctamente',
              });

              this.listShifts();
              this.shiftsDialog = false;
              this.shift = {};
          },
          error: (e) => {
              console.error('Error al crear el turno:', e);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Hubo un error al crear el turno',
              });
          },
      });
  }
}



  deleteShift(shifts: Shifts) {
    this.shift = { ...shifts };  
    this.deleteshiftsDialog = true; // Abrir el cuadro de diálogo
  }

  confirmDelete() {
    // Llamar al servicio para eliminar 
    this.shiftsService.deleteShiftsId(this.shift.id).subscribe({
      next: () => {
        // Eliminar de la lista 
        this.shifts = this.shifts.filter(shifts => shifts.id !== this.shift.id);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Turno Eliminado',
          life: 3000
        });

        this.shift = {};

        // Cerrar el cuadro de diálogo de eliminación
        this.deleteshiftsDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar El Turno',
          life: 3000
        });
        console.error(e);
      }
    });
  }

  onGlobalFilter(dt: any, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    dt.filterGlobal(value, 'contains');
  }

  // Método para eliminar
  deleteSelectedShifts() {
    if (this.selectedShifts.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione los turnos que desea eliminar.',
        life: 3000
      });
      return;
    }
    this.deleteshiftDialog = true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación 
  confirmDeleteSelected() {
    const selectedIds = this.selectedShifts.map(species => species.id);

    // Llamar al servicio para eliminar 
    this.shiftsService.deleteSelectedShifts(selectedIds).subscribe({
      next: () => {
        // Eliminar 
        this.shifts = this.shifts.filter(shifts => !this.selectedShifts.includes(shifts));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Turnos Eliminadas Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedShifts = [];
        this.deleteshiftDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar los turnos seleccionadaos.',
          life: 3000
        });
        console.error(e);
      }
    });
  }
}
