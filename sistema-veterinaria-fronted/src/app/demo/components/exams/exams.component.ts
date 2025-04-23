import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ExamsService } from '../../service/exams.service';
import { Exams } from '../../api/exams';
import { DropdownModule } from 'primeng/dropdown';
import { QueriesService } from '../../service/queries.service';
import { Queries } from '../../api/queries';

@Component({
  selector: 'app-exams',
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
    ReactiveFormsModule,
    DropdownModule
  ],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.scss',
  providers: [MessageService]
})
export class ExamsComponent {

  exams: Exams[] = [];

  exam: Exams = {
    queries_idqueries: 0
  };

    selectedExams: Exams[] = [];

    //Abrir el formulario 
    ExamsDialog: boolean = false;

    isEditing: boolean = false;
  
    submitted: boolean = false;

    deleteExamsDialog: boolean = false;

    Queries: Queries[] = [];

    examsForm: FormGroup;

    deleteExamDialog: boolean = false;

  constructor(
    private ExamsService:ExamsService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private QueriesService:QueriesService
  ){}

  ngOnInit(): void {
    this.listExam();  // Llamar al servicio para obtener la lista 
    this.listQueries();

    this.examsForm = this.fb.group({
      mucous_membrane: ['', Validators.required],
      fur: ['', Validators.required],
      oral: ['', Validators.required],
      reproductive_system: ['', Validators.required],
      rectal: ['', Validators.required],
      eyes: ['', Validators.required],
      lymph_modules: ['', Validators.required],
      locomotion: ['', Validators.required],
      cardiovascular_system: ['', Validators.required],
      respiratory_system: ['', Validators.required],
      digestive_system: ['', Validators.required],
      urinary_system: ['', Validators.required],
      queries_idqueries: ['', Validators.required] // Si necesitas validación
    });
  }

  openNew() {
    this.exam = { queries_idqueries: null }; // Debe ser null para que el usuario elija
    this.examsForm.reset(); // Resetear el formulario completamente
    this.isEditing = false; 
    this.submitted = false;
    this.ExamsDialog = true;
}


  hideDialog() {
    this.ExamsDialog = false;
    this.submitted = false;
  }

  listExam() {
    this.ExamsService.getExamslist().subscribe({
      next: (res) => {
        this.exams = res;
        console.log("exams", this.exams);
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

  saveExams() {
    this.submitted = true;

    if (this.examsForm.invalid) {
        return; // No guardar si el formulario es inválido
    }

    const examData = { ...this.examsForm.value }; // Obtener los datos del formulario
    console.log("Datos a guardar:", examData); // Depuración

    if (this.isEditing) {
        this.ExamsService.updateExams(this.exam.id, examData).subscribe({
            next: (updatedExams) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Examen actualizado correctamente'
                });
                this.listExam();
                this.ExamsDialog = false;
            },
            error: (e) => {
                console.error('Error al actualizar el examen', e);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Hubo un error al actualizar el examen'
                });
            }
        });
    } else {
        this.ExamsService.createExams(examData).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Examen guardado correctamente'
                });
                this.listExam();
                this.ExamsDialog = false;
            },
            error: (e) => {
                console.error('Error al guardar el examen', e);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Hubo un error al guardar el examen'
                });
            }
        });
    }
}
  
  editExams(exams: Exams) {
    this.exam = { ...exams };
    this.examsForm.patchValue(this.exam); // Sincronizar los valores con el formulario
    this.isEditing = true;
    this.ExamsDialog = true;
}


  // Mostrar el cuadro de diálogo de eliminación
  deleteExams(exams:Exams) {
    this.exam = { ...exams };  
    this.deleteExamsDialog = true; 
  }

  confirmDelete() {
    this.ExamsService.deleteExamsId(this.exam.id).subscribe({
      next: () => {
        // Eliminar de la lista 
        this.exams = this.exams.filter(exam => exam.id !== this.exam.id);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Examen Eliminado',
          life: 3000
        });

        this.exam = {queries_idqueries:0};

        // Cerrar el cuadro de diálogo de eliminación
        this.deleteExamsDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar El Examen',
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
   deleteSelectedExams() {
    if (this.selectedExams.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione los examenes que desea eliminar.',
        life: 3000
      });
      return;
    }
    this.deleteExamDialog = true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación 
  confirmDeleteSelected() {
    const selectedIds = this.selectedExams.map(species => species.id);

    // Llamar al servicio para eliminar 
    this.ExamsService.deleteSelectedExams(selectedIds).subscribe({
      next: () => {
        // Eliminar 
        this.exams = this.exams.filter(exams => !this.selectedExams.includes(exams));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Examenes Eliminados Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedExams = [];
        this.deleteExamDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar los examenes seleccionados.',
          life: 3000
        });
        console.error(e);
      }
    });
  }

}
