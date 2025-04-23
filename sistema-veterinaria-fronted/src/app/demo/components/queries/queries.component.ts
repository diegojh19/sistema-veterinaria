import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Queries } from '../../api/queries';
import { QueriesService } from '../../service/queries.service';
import { PatientsService } from '../../service/patients.service';
import { Patients } from '../../api/patients';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-queries',
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
    TooltipModule,
    RippleModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './queries.component.html',
  styleUrl: './queries.component.scss',
  providers: [MessageService]

})
export class QueriesComponent {

  Queries: Queries[] = [];
  
  Querie : Queries = {
    next_consultation: undefined
  };

  selectedQueries: Queries[] = [];

  patients: Patients[] = [];

    //Abrir el formulario 
    QuerieDialog: boolean = false;

    isEditing: boolean = false;
  
    submitted: boolean = false;

    deleteQueriesDialog: boolean = false;

    deleteQuerieDialog: boolean = false;


    formsqueries!: FormGroup;


  constructor(
    private QueriesService:QueriesService,
    private patientsService:PatientsService,
    private messageService: MessageService,
    private fb: FormBuilder


  ){}

  ngOnInit(): void {
    this.listQueries();   
    this.listPatients();

    // Inicializar el formulario con validaciones
    this.formsqueries = this.fb.group({
      consultation_date: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      past: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      diseases: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      next_consultation: ['', [Validators.required]],
      patients_idpatients: ['', [Validators.required]],

    });
  }

  openNew() {
    this.Querie = { ...this.formsqueries.value };

    this.isEditing = false; // Establecer que no es edición
    this.submitted = false;
    this.formsqueries.reset(); //
    this.QuerieDialog = true;
  }

  hideDialog() {
    this.QuerieDialog = false;
    this.submitted = false;
  }

  
  getSelectedQuerieName(): string {
    const selectedQuerie = this.patients.find(patient => patient.id === this.Querie.patients_idpatients);
    return selectedQuerie ? selectedQuerie.name_patients : '';
  }

  listQueries() {
    this.QueriesService.getQuerieslist().subscribe({
      next: (res) => {
        // Si la fecha viene como un objeto Date, convertirla al formato YYYY-MM-DD
        this.Queries = res.map(query => {
          query.consultation_date = query.consultation_date ? new Date(query.consultation_date).toISOString().split('T')[0] : ''; // Asegura el formato correcto
          query.next_consultation = query.next_consultation ? new Date(query.next_consultation).toISOString().split('T')[0] : ''; // Asegura el formato adecuado para next_consultation
          return query;
        });
        console.log("Queries", this.Queries);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }
  

  listPatients() {
    this.patientsService.getPatientslist().subscribe({
      next: (res) => {
        this.patients = res;
        console.log("Patients", this.patients);
      },
      error: (e) => {
        console.error(e);
      }
    });

  }

  getPatientsName(patients_idpatients: number): string {
    const patient = this.patients.find(s => s.id === patients_idpatients);  
    return patient? patient.name_patients : 'N/A'; // Devuelve 'N/A' si no se encuentra 
  }
  editQuerie(queries: Queries) {
    console.log('Objeto queries al editar:', queries);  // Verifica que el objeto que recibes tenga un id
    if (!queries.id) {
        console.error('Error: El objeto de la consulta no tiene un id válido');
        return;
    }

    this.Querie = { ...queries };
    console.log('Objeto Querie después de asignar:', this.Querie);  // Verifica que el id se asigna correctamente

    this.formsqueries.patchValue({
        consultation_date: queries.consultation_date,
        reason: queries.reason,
        past: queries.past,
        diseases: queries.diseases,
        next_consultation: queries.next_consultation,
        patients_idpatients: queries.patients_idpatients
    });

    this.isEditing = true;
    this.QuerieDialog = true;
}

saveQuerie() {
  this.submitted = true;

  if (this.formsqueries.invalid) {
      this.messageService.clear();
      this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Por favor, complete correctamente todos los campos del formulario',
          life: 3000  // Duración del mensaje
      });
      return;
  }

  // Asegurar que el ID no se pierda
  this.Querie = { 
    ...this.formsqueries.value, 
    id: this.Querie.id || this.formsqueries.value.id 
  };

  // Formateamos las fechas si están presentes
  this.Querie.consultation_date = this.Querie.consultation_date 
    ? new Date(this.Querie.consultation_date).toISOString().split('T')[0] 
    : '';

  this.Querie.next_consultation = this.Querie.next_consultation 
    ? new Date(this.Querie.next_consultation).toISOString().split('T')[0] 
    : '';

  console.log('🔎 ID de la consulta antes de guardar:', this.Querie.id);

  if (this.Querie.id) {  
      console.log('✏️ Actualizando consulta con ID:', this.Querie.id);

      this.QueriesService.updateQueries(this.Querie.id, this.Querie).subscribe({
          next: (updatedQuerie) => {
              const index = this.Queries.findIndex((s) => s.id === updatedQuerie.id);
              if (index !== -1) {
                  this.Queries[index] = updatedQuerie;
              }

              this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Consulta Actualizada Correctamente',
              });

              this.listQueries();
              this.QuerieDialog = false;
              this.Querie = { next_consultation: undefined };

              
          },
          error: (e) => {
              console.error('❌ Error al actualizar la consulta:', e);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Hubo un error al actualizar la consulta',
              });
          },
      });
  } else {  
      console.log('🆕 Creando nueva consulta');

      this.QueriesService.createQueries(this.Querie).subscribe({
          next: (res) => {
              this.Queries.push(res);

              this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Consulta Guardada Correctamente',
              });

              this.listQueries();
              this.QuerieDialog = false;
              this.Querie = { next_consultation: undefined };
          },
          error: (e) => {
              console.error('❌ Error al guardar la consulta:', e);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Hubo un error al guardar la consulta',
              });
          },
      });
  }
}

  
  // Mostrar el cuadro de diálogo de eliminación
  deleteQuerie(queries: Queries) {
    this.Querie = { ...queries };  
    this.deleteQueriesDialog = true; 
  }

  confirmDelete() {
    // Llamar al servicio para eliminar 
    this.QueriesService.deleteQueriesId(this.Querie.id).subscribe({
      next: () => {
        // Eliminar de la lista 
        this.Queries = this.Queries.filter(Queries => Queries.id !== this.Querie.id);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Consulta Eliminada',
          life: 3000
        });

        this.Querie = {
          next_consultation: undefined
        };

        // Cerrar el cuadro de diálogo de eliminación
        this.deleteQueriesDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar La Consulta',
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
  deleteSelectedQueries() {
    if (this.selectedQueries.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione las consultas que desea eliminar.',
        life: 3000
      });
      return;
    }
    this.deleteQuerieDialog = true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación 
  confirmDeleteSelected() {
    const selectedIds = this.selectedQueries.map(species => species.id);

    // Llamar al servicio para eliminar 
    this.QueriesService.deleteSelectedQueries(selectedIds).subscribe({
      next: () => {
        // Eliminar 
        this.Queries = this.Queries.filter(Queries => !this.selectedQueries.includes(Queries));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consultas Eliminadas Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedQueries = [];
        this.deleteQuerieDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar las consultas seleccionadas.',
          life: 3000
        });
        console.error(e);
      }
    });
  }
}
