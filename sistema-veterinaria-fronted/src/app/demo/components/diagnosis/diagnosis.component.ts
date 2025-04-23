import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Diagnosis } from '../../api/diagnosis';
import { DiagnosisService } from '../../service/diagnosis.service';
import { Queries } from '../../api/queries';
import { QueriesService } from '../../service/queries.service';
import { query } from '@angular/animations';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-diagnosis',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    DialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './diagnosis.component.html',
  styleUrl: './diagnosis.component.scss',
  providers: [MessageService]
})
export class DiagnosisComponent {

  diagnosis: Diagnosis[] = [];

  diagnosi: Diagnosis = {};

  selectedDiagnosis: Diagnosis[] = [];

  Queries: Queries[] = [];

   //Abrir el formulario 
   diagnosisDialog: boolean = false;

   isEditing: boolean = false;
 
   submitted: boolean = false;

   formsdiagnosis!: FormGroup;

   deleteDiagnosisDialog: boolean = false;

   deleteDiagnosiDialog: boolean = false;


  constructor(
    private diagnosisService:DiagnosisService,
    private QueriesService:QueriesService,
    private messageService: MessageService,
    private fb: FormBuilder

  ){}

  ngOnInit(): void {
    
    this.listQueries();
    this.listDiagnosis();   

    // Inicializar el formulario con validaciones
    this.formsdiagnosis = this.fb.group({
      detail_diagnosis: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      date_diagnosis: ['', [Validators.required]],
      queries_idqueries: ['', [Validators.required]]

    });
  }
  
  openNew() {
    this.diagnosi = {};
    this.isEditing = false; // Establecer que no es edición
    this.submitted = false;
    this.formsdiagnosis.reset(); //
    this.diagnosisDialog = true;
  }

  hideDialog() {
    this.diagnosisDialog = false;
    this.submitted = false;
  }

  formatDate(dateString: string | Date): string {
    if (!dateString) return '';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        console.error("Fecha no válida:", dateString);
        return '';
    }

    return date.toISOString().split('T')[0]; // Extrae solo la parte de la fecha en formato YYYY-MM-DD
}


  editDiagnosis(diagnosis: Diagnosis) {
    if (!diagnosis) {
        console.error("Error: diagnóstico no válido.");
        return;
    }

    this.isEditing = true;
    this.diagnosi = { ...diagnosis };

    // Convertir la fecha al formato YYYY-MM-DD para que el input date la acepte
    const formattedDate = this.formatDate(diagnosis.date_diagnosis);

    this.formsdiagnosis.patchValue({
        detail_diagnosis: diagnosis.detail_diagnosis || '',
        date_diagnosis: formattedDate,  // Asignamos la fecha formateada
        queries_idqueries: diagnosis.queries_idqueries || ''
    });

    console.log("Diagnóstico cargado en el formulario:", this.formsdiagnosis.value);

    this.diagnosisDialog = true;
}




  listDiagnosis() {
    this.diagnosisService.getDiagnosislist().subscribe({
      next: (res) => {
        this.diagnosis = res;
        console.log("Diagnosis", this.diagnosis); 

      // Asegura de que el valor de queries_idqueries sea válido
        if (this.isEditing && this.diagnosi.queries_idqueries) {
          const selectedQuery = this.Queries.find(query => query.id === this.diagnosi.queries_idqueries);
          if (selectedQuery) {
            this.diagnosi.queries_idqueries = selectedQuery.id;
          }
        } 
      },
      error: (e) => {
        console.error(e);
      }
    });

  }

  listQueries() {
    this.QueriesService.getQuerieslist().subscribe({
      next: (res) => {
        this.Queries = res;
        console.log("Queries", this.Queries);

         // Transformar los datos para mostrar una combinación de fecha y razón
      this.Queries = this.Queries.map(query => ({
        ...query,
        reason: `Consulta del ${query.consultation_date}: ${query.reason}`
      }));

      console.log("Queries transformadas", this.Queries);
      },
      error: (e) => {
        console.error(e);
      }
    });
  
  }

  getPatientsName(patients_idpatients: number): string {
    // Buscar en el array 'this.breed' que es donde están almacenadas las razas
    const patient = this.Queries.find(s => s.id === patients_idpatients);  // Usamos 'this.breed' aquí
    return patient? patient.diseases : 'N/A'; // Devuelve 'N/A' si no se encuentra la raza
  }

  getSelectedQuerieName(): string {
    const selectedQuerie = this.Queries.find(query => query.id === this.diagnosi.queries_idqueries);
    return selectedQuerie ? selectedQuerie.reason : 'No disponible';
}


saveDiagnosis() {
  this.submitted = true;

  if (this.formsdiagnosis.invalid) {
      this.messageService.clear();
      this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Por favor, complete correctamente todos los campos del formulario',
          life: 3000  // Duración del mensaje
      });
      return;
  }

  this.diagnosi = { ...this.diagnosi, ...this.formsdiagnosis.value };
  console.log("Datos antes de enviar al backend:", this.diagnosi);

  if (this.diagnosi.id) {
      this.diagnosisService.updateDiagnosis(this.diagnosi.id, this.diagnosi).subscribe({
          next: (updatedDiagnosi) => {
              const index = this.diagnosis.findIndex((s) => s.id === updatedDiagnosi.id);
              if (index !== -1) {
                  this.diagnosis[index] = updatedDiagnosi;
              }

              this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Diagnóstico Actualizado Correctamente',
              });

              this.listDiagnosis();
              this.diagnosisDialog = false;
              this.diagnosi = {};
          },
          error: (e) => {
              console.error('Error Al Actualizar El Diagnóstico', e);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Hubo Un Error Al Actualizar El Diagnóstico',
              });
          },
      });
  } else {
      this.diagnosisService.createDiagnosis(this.diagnosi).subscribe({
          next: (res) => {
              this.diagnosis.push(res);
              this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Diagnóstico Guardado Correctamente',
              });

              this.listDiagnosis();
              this.diagnosisDialog = false;
              this.diagnosi = {};
          },
          error: (e) => {
              console.error('Error Al Guardar El Diagnóstico', e);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Hubo Un Error Al Guardar El Diagnóstico',
              });
          },
      });
  }
}

 // Mostrar el cuadro de diálogo de eliminación
 deleteDiagnosis(diagnosis: Diagnosis) {
  this.diagnosi = { ...diagnosis };  
  this.deleteDiagnosisDialog = true; // Abrir el cuadro de diálogo
}

confirmDelete() {
  // Llamar al servicio para eliminar
  this.diagnosisService.deleteDiagnosisId(this.diagnosi.id).subscribe({
    next: () => {
      // Eliminar de la lista 
      this.diagnosis = this.diagnosis.filter(specie => specie.id !== this.diagnosi.id);

      // Mostrar mensaje de éxito
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Diagnóstico Eliminado',
        life: 3000
      });

      // Limpiar el objeto 
      this.diagnosi = {};

      // Cerrar el cuadro de diálogo de eliminación
      this.deleteDiagnosisDialog = false;
    },
    error: (e) => {
      // Mostrar mensaje de error si falla la eliminación
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error Al Eliminar El Diagnóstico',
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
deleteSelectedDiagnosis() {
  if (this.selectedDiagnosis.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Por favor, seleccione los diagnosticos que desea eliminar.',
      life: 3000
    });
    return;
  }
  this.deleteDiagnosiDialog = true; // Abrir el cuadro de diálogo de confirmación
}

// Confirmar eliminación 
confirmDeleteSelected() {
  const selectedIds = this.selectedDiagnosis.map(species => species.id);

  // Llamar al servicio para eliminar 
  this.diagnosisService.deleteSelectedDiagnosis(selectedIds).subscribe({
    next: () => {
      // Eliminar 
      this.diagnosis = this.diagnosis.filter(diagnosis => !this.selectedDiagnosis.includes(diagnosis));

      // Mostrar mensaje de éxito
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Diagnosticos Eliminadas Correctamente',
        life: 3000
      });

      // Limpiar la selección y cerrar el cuadro de diálogo
      this.selectedDiagnosis = [];
      this.deleteDiagnosiDialog = false;
    },
    error: (e) => {
      // Mostrar mensaje de error si falla la eliminación
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un error al eliminar los diagnosticos seleccionados.',
        life: 3000
      });
      console.error(e);
    }
  });
}

}
