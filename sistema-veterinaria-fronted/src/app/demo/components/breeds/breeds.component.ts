import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { Breeds } from '../../api/breeds';
import { BreedsService } from '../../service/breeds.service';
import { Species } from '../../api/species';
import { SpeciesService } from '../../service/species.service';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-breeds',
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
    ReactiveFormsModule,

  ],
  templateUrl: './breeds.component.html',
  styleUrl: './breeds.component.scss',
  providers: [MessageService]

})
export class BreedsComponent {

  breeds: Breeds[] = [];

  breedsDialog: boolean = false;

  isEditing: boolean = false;

  breed: Breeds = {};

  submitted: boolean = false;

  selectedBreeds: Breeds[] = [];

  deleteBreedsDialog: boolean = false;
// 
  deleteBreedDialog: boolean = false;

  Species: Species[] = [];

  formsbreeds!: FormGroup;

  constructor(
    private breedsService: BreedsService,
    private messageService: MessageService,
    private SpeciesService: SpeciesService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.breeds = [];
    this.listBreeds();  // Llamar al servicio para obtener la lista 
    this.getSpecies();

    // Inicializar el formulario con validaciones
    this.formsbreeds = this.fb.group({

      name_breeds: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]
      ],
      speciesId: ['', Validators.required]  // ID de la especie seleccionada
    });
  }

  get f() {
    return this.formsbreeds.controls;
  }

  openNew() {
    this.breed = {};
    this.isEditing = false; // Establecer que no es edición
    this.submitted = false;
    this.formsbreeds.reset(); //
    this.breedsDialog = true;
  }

  hideDialog() {
    this.breedsDialog = false;
    this.submitted = false;
  }

  getSpeciesName(speciesId: number): string {
    const species = this.Species.find(s => s.id === speciesId);
    return species ? species.name_species : 'N/A'; // Devuelve 'N/A' si no se encuentra la especie
  }


  listBreeds() {
    this.breedsService.getBreedslist().subscribe({
      next: (res) => {
        this.breeds = res;
        console.log("aqui", this.breeds);
      },
      error: (e) => {
        console.error(e);
      }
    });

  }

  editBreeds(breed: Breeds) {
    this.isEditing = true;
    this.breed = { ...breed }; // Clonar la raza seleccionada
    this.formsbreeds.patchValue({
      name_breeds: this.breed.name_breeds,
      speciesId: this.breed.speciesId
    });
    this.breedsDialog = true;
  }


  getSelectedSpeciesName(): string {
    const selectedSpecies = this.Species.find(species => species.id === this.breed.speciesId);
    return selectedSpecies ? selectedSpecies.name_species : '';
  }


  // Mostrar el cuadro de diálogo de eliminación
  deleteSpecies(specie: Breeds) {
    this.breed = { ...specie };  // Copiar la especie seleccionada
    this.deleteBreedsDialog = true; // Abrir el cuadro de diálogo
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSpecies() {
    this.SpeciesService.getSpecieslist().subscribe({
      next: (data) => {
        console.log('Datos Obtenidos De Especies:', data);
        this.Species = data;
      },
      error: (e) => {
        console.error('Error Al Obtener Especies:', e);
      },
    });
  }


  saveBreeds() {
    this.submitted = true;


    // Verificar si el formulario es válido antes de continuar
    if (this.formsbreeds.invalid) {
      this.messageService.clear();  // Limpiar cualquier toast anterior
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete correctamente todos los campos del formulario',
        life: 3000  // Duración del mensaje
      });
      return;
    }


    // Asignar el valor de speciesId desde el formulario
    this.breed.speciesId = this.formsbreeds.get('speciesId')?.value;
    this.breed.name_breeds = this.formsbreeds.get('name_breeds')?.value;

    if (this.breed.id) {
      // Si la raza tiene un ID, se trata de una edición
      this.breedsService.updateBreeds(this.breed.id, this.breed).subscribe({
        next: (updatedBreeds) => {
          // Actualizar la raza en la lista (es decir, en el arreglo 'breed')
          const index = this.breeds.findIndex((s) => s.id === updatedBreeds.id);
          if (index !== -1) {
            this.breeds[index] = updatedBreeds;
          }
          this.messageService.clear();  // Limpiar cualquier toast anterior
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Raza Actualizada Correctamente',
          });

          // Actualizar la lista de razas
          this.listBreeds();

          // Cerrar el diálogo y limpiar el formulario
          this.breedsDialog = false;
          this.breed = {}; // Limpiar formulario 
        },
        error: (e) => {
          console.error('Error Al Actualizar La Raza', e);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo Un Error Al Actualizar La Raza',
            life: 3000  // Duración del mensaje
          });
        },
      });
    } else {
      // Si no tiene un ID, se trata de una creación
      this.breedsService.createBreeds(this.breed).subscribe({
        next: (res) => {
          // Agregar la nueva raza a la lista
          this.breeds.push(res);
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Raza Guardada Correctamente',
            life: 3000  // Duración del mensaje
          });

          // Actualizar la lista de razas 
          this.listBreeds();

          // Cerrar el diálogo y limpiar el formulario
          this.breedsDialog = false;
          this.breed = {}; // Limpiar formulario 
        },
        error: (e) => {
          console.error('Error Al Guardar La Raza', e);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo Un Error Al Guardar La Raza',
            life: 3000  // Duración del mensaje
          });
        },
      });
    }

  }

  confirmDelete() {
    // Llamar al servicio para eliminar
    this.breedsService.deleteBreedsId(this.breed.id).subscribe({
      next: () => {
        // Eliminar de la lista 
        this.breeds = this.breeds.filter(breeds => breeds.id !== this.breed.id);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Raza Eliminada',
          life: 3000
        });

        // Limpiar el objeto de raza
        this.breed = {};

        // Cerrar el cuadro de diálogo de eliminación
        this.deleteBreedsDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar La Raza',
          life: 3000
        });
        console.error(e);
      }
    });
  }

   // Método para eliminar
   deleteSelectedBreeds() {
    if (this.selectedBreeds.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione las razas que desea eliminar.',
        life: 3000
      });
      return;
    }
    this.deleteBreedDialog = true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación 
  confirmDeleteSelected() {
    const selectedIds = this.selectedBreeds.map(species => species.id);

    // Llamar al servicio para eliminar 
    this.breedsService.deleteSelectedBreeds(selectedIds).subscribe({
      next: () => {
        // Eliminar 
        this.breeds = this.breeds.filter(breeds => !this.selectedBreeds.includes(breeds));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Razas Eliminadas Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedBreeds = [];
        this.deleteBreedDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar las razas seleccionadas.',
          life: 3000
        });
        console.error(e);
      }
    });
  }

}
