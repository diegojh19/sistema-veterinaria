import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Species } from 'src/app/demo/api/species';
import { SpeciesService } from 'src/app/demo/service/species.service';

@Component({
  selector: 'app-species',
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
  ],
  templateUrl: './species.component.html',
  styleUrl: './species.component.scss',
  providers: [MessageService]
})
export class SpeciesComponent {
  //Abrir Formulario
  speciesDialog: boolean = false;
  //Abrir Para Eliminar 1
  deleteSpeciesDialog: boolean = false;
  //Abrir Para Eliminar varios
  deleteSpecieDialog: boolean = false;

  species: Species = {};

  submitted: boolean = false;

  specie: Species[] = [];

  isEditing: boolean = false;

  selectedSpecies: Species[] = [];

  filteredSpecies: any[] = [];

  formspecies!: FormGroup;

  constructor(
    private speciesService: SpeciesService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    // this.specie = [];  // Asegúrate de que sea un arreglo vacío
    this.listSpecies();  // Llamar al servicio para obtener la lista 

    // Inicializar el formulario con validaciones
    this.formspecies = this.fb.group({
      name_species: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]]
    });
  }

  get f() {
    return this.formspecies.controls;
  }

  openNew() {
    this.species = {};
    this.isEditing = false; // Establecer que no es edición
    this.submitted = false;
    this.formspecies.reset(); //
    this.speciesDialog = true;
  }
  hideDialog() {
    this.speciesDialog = false;
    this.submitted = false;
  }

  listSpecies() {
    this.speciesService.getSpecieslist().subscribe({
      next: (res) => {
        this.specie = res;
        console.log("aqui", this.specie);
      },
      error: (e) => {
        console.error(e);
      }
    });

  }

  editSpecies(specie: Species) {
    this.species = { ...specie };  // Asigna el objeto de especie específico
    this.isEditing = true; // Establecer que es edición
    // Cargar valores en el formulario
    this.formspecies.patchValue({
      name_species: this.species.name_species,

    });
    this.speciesDialog = true;     // Abre el diálogo para editar la especie
  }

  saveSpecies() {
    this.submitted = true;

    // Verificar si el formulario es válido antes de continuar
    if (this.formspecies.invalid) {
      this.messageService.clear();  // Limpiar cualquier toast anterior
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario Incompleto',
        detail: 'Por favor, complete correctamente todos los campos del formulario',
        life: 3000  // Duración del mensaje
      });
      return;
    }

    // Asigna los valores correctamente desde el formulario
    this.species = {
      ...this.species,
      name_species: this.formspecies.value.name_species,
    };

    if (this.species.id) {
      // Actualizar especie
      this.speciesService.updateSpecies(this.species.id, this.species).subscribe({
        next: (updatedSpecies) => {
          const index = this.specie.findIndex((s) => s.id === updatedSpecies.id);
          if (index !== -1) {
            this.specie[index] = updatedSpecies;
          }

          // Mostrar mensaje de éxito
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Especie Actualizada Correctamente',
            life: 3000  // Duración del mensaje
          });

          this.listSpecies();
          this.speciesDialog = false;
          this.species = {};
        },
        error: (e) => {
          console.error('Error Al Actualizar La Especie', e);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo Un Error Al Actualizar La Especie',
            life: 3000  // Duración del mensaje
          });
        },
      });
    } else {
      // Crear nueva especie
      this.speciesService.createSpecies(this.species).subscribe({
        next: (res) => {
          this.specie.push(res);
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Especie Guardada Correctamente',
            life: 3000  // Duración del mensaje
          });

          this.listSpecies();
          this.speciesDialog = false;
          this.species = {};
        },
        error: (e) => {
          console.error('Error Al Guardar La Especie', e);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo Un Error Al Guardar La Especie',
            life: 3000  // Duración del mensaje
          });
        },
      });
    }
  }




  confirmDelete() {
    // Llamar al servicio para eliminar
    this.speciesService.deleteSpeciesId(this.species.id).subscribe({
      next: () => {
        // Eliminar de la lista 
        this.specie = this.specie.filter(specie => specie.id !== this.species.id);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Especie Eliminada',
          life: 3000
        });

        // Limpiar el objeto 
        this.species = {};

        // Cerrar el cuadro de diálogo de eliminación
        this.deleteSpeciesDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar La Especie',
          life: 3000
        });
        console.error(e);
      }
    });
  }

  // Mostrar el cuadro de diálogo de eliminación
  deleteSpecies(specie: Species) {
    this.species = { ...specie };  // Copiar la especie seleccionada
    this.deleteSpeciesDialog = true; // Abrir el cuadro de diálogo
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  // Método para eliminar varias especies
  deleteSelectedSpecies() {
    if (this.selectedSpecies.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione las especies que desea eliminar.',
        life: 3000
      });
      return;
    }
    this.deleteSpecieDialog = true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación de varias especies
  confirmDeleteSelected() {
    const selectedIds = this.selectedSpecies.map(species => species.id);

    // Llamar al servicio para eliminar las especies seleccionadas
    this.speciesService.deleteSelectedSpecies(selectedIds).subscribe({
      next: () => {
        // Eliminar las especies seleccionadas de la lista local
        this.specie = this.specie.filter(species => !this.selectedSpecies.includes(species));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Especies Eliminadas Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedSpecies = [];
        this.deleteSpecieDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar las especies seleccionadas.',
          life: 3000
        });
        console.error(e);
      }
    });
  }


}

