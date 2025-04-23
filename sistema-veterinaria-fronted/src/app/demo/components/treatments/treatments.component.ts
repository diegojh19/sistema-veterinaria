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
import { Treatments } from '../../api/treatments';
import { TreatmentsService } from '../../service/treatments.service';
import { DiagnosisService } from '../../service/diagnosis.service';
import { Diagnosis } from '../../api/diagnosis';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-treatments',
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
    ReactiveFormsModule
  ],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.scss',
  providers: [MessageService]

})
export class TreatmentsComponent {

  treatments: Treatments[] = [];

  treatment: Treatments = {
    diagnosis_iddianosis: 0
  };

  diagnosis: Diagnosis[] = [];

  //Abrir el formulario 
  treatmentDialog: boolean = false;

  isEditing: boolean = false;

  submitted: boolean = false;

  deleTreatmenstDialog: boolean = false;

  formstreatments!: FormGroup;

  selectedTreatments: Treatments[] = [];

  deleTreatmentDialog: boolean = false;

  constructor(
    private treatmentsService:TreatmentsService,
    private diagnosisService:DiagnosisService,
    private messageService: MessageService,
    private fb: FormBuilder

  ){}

  ngOnInit(): void {
    this.listDiagnosis();

    this.listTreatments();  // Llamar al servicio para obtener la lista 

    // Inicializar el formulario con validaciones
    this.formstreatments = this.fb.group({
      detail_treatments: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      diagnosis_iddianosis: ['', [Validators.required]]  // Aquí debe ser null inicialmente, no 0
    });
  }
   
  openNew() {
    this.treatment = {
      diagnosis_iddianosis: null
    };
    
    this.isEditing = false; // Establecer que no es edición
    this.submitted = false;
    this.formstreatments.reset(); //
    this.treatmentDialog = true;
  }

  hideDialog() {
    this.treatmentDialog = false;
    this.submitted = false;
  }

  getSelectedTreatmentsName(): string {
    const selectedtreatment = this.diagnosis.find(diagnosi => diagnosi.id === this.treatment.diagnosis_iddianosis);
    return selectedtreatment ? selectedtreatment.detail_diagnosis : '';
  }

  editTreatment(treatment: Treatments) {
    this.treatment = { ...treatment };  // Clonar el tratamiento para evitar modificaciones accidentales
  
    // Establecer los valores del formulario con los valores del tratamiento
    this.formstreatments.setValue({
      detail_treatments: this.treatment.detail_treatments,
      diagnosis_iddianosis: this.treatment.diagnosis_iddianosis
    });
  
    this.isEditing = true;  
    this.treatmentDialog = true; // Abrir el formulario de tratamiento
  }
  

  // Mostrar el cuadro de diálogo de eliminación
  deleteTreatments(treatment: Treatments) {
    this.treatment = { ...treatment }; 
    this.deleTreatmenstDialog = true; // Abrir el cuadro de diálogo
  }
  
  
  listTreatments() {
    this.treatmentsService.getTreatmentslist().subscribe({
      next: (res) => {
        this.treatments = res;
        console.log("Treatments", this.treatments);
      },
      error: (e) => {
        console.error(e);
      }
    });

  }

  listDiagnosis() {
    this.diagnosisService.getDiagnosislist().subscribe({
      next: (res) => {
        this.diagnosis = res;
        console.log('Diagnósticos cargados:', this.diagnosis);
      },
      error: (e) => {
        console.error('Error al cargar diagnósticos', e);
      }
    });
  }
  
  
 

  saveTreatments() {
    this.submitted = true;
  
    // Obtener los valores del formulario
    const formValues = this.formstreatments.value;
    const detailTreatments = formValues.detail_treatments;
    const diagnosisId = formValues.diagnosis_iddianosis;
  
    // Validación de formulario
    if (this.formstreatments.invalid) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete correctamente todos los campos del formulario',
        life: 3000  // Duración del mensaje
      });
      return;
    }
  
    // Validación de diagnosis_iddianosis
    if (!diagnosisId || diagnosisId === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar un diagnóstico válido'
      });
      return;
    }
  
    // Asignar los valores del formulario al objeto treatment
    this.treatment.detail_treatments = detailTreatments;
    this.treatment.diagnosis_iddianosis = diagnosisId;
  
    // Proceder con la creación o actualización del tratamiento
    if (this.treatment.id) {
      this.treatmentsService.updateTreatments(this.treatment.id, this.treatment).subscribe({
        next: (updatedTreatments) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Tratamiento Actualizado Correctamente',
          });
          
        // Recargar la lista de tratamientos
        this.listTreatments();

        // Cerrar el diálogo y limpiar el formulario
        this.treatmentDialog = false;
        this.treatment = { diagnosis_iddianosis: null };
        
        },
        error: (e) => {
          console.error('Error al actualizar tratamiento', e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un error al actualizar el tratamiento',
          });
        }
      });
    } else {
      this.treatmentsService.createTreatments(this.treatment).subscribe({
        next: (res) => {
          this.treatments.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Tratamiento Guardado Correctamente',
          });

        // Recargar la lista de tratamientos
        this.listTreatments();

        // Cerrar el diálogo y limpiar el formulario
        this.treatmentDialog = false;
        this.treatment = { diagnosis_iddianosis: null };        },
        error: (e) => {
          console.error('Error al guardar tratamiento', e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un error al guardar el tratamiento',
          });
        }
      });
    }
  }
  
  
  


  confirmDelete() {
    // Llamar al servicio para eliminar 
    this.treatmentsService.deleteTreatmentsId(this.treatment.id).subscribe({
      next: () => {
        // Eliminar de la lista 
        this.treatments = this.treatments.filter(treatment => treatment.id !== this.treatment.id);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Tratamiento Eliminado',
          life: 3000
        });

        this.treatment = {
          diagnosis_iddianosis:0
        };

        // Cerrar el cuadro de diálogo de eliminación
        this.deleTreatmenstDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar El Tratamiento',
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
   deleteSelectedTreatment() {
    if (this.selectedTreatments.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione los tratamientos que desea eliminar.',
        life: 3000
      });
      return; 
    }
    this.deleTreatmentDialog = true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación 
  confirmDeleteSelected() {
    const selectedIds = this.selectedTreatments.map(species => species.id);

    // Llamar al servicio para eliminar 
    this.treatmentsService.deleteSelectedTreatments(selectedIds).subscribe({
      next: () => {
        // Eliminar 
        this.treatments = this.treatments.filter(treatments => !this.selectedTreatments.includes(treatments));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Tratamientos Eliminados Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedTreatments = [];
        this.deleTreatmentDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar los tratamientos seleccionados.',
          life: 3000
        });
        console.error(e);
      }
    });
  }

}
