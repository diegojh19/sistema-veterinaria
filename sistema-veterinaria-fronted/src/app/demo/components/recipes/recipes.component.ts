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
import { Recipes } from '../../api/recipes';
import { RecipesService } from '../../service/recipes.service';
import { Patients } from '../../api/patients';
import { PatientsService } from '../../service/patients.service';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-recipes',
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
    DropdownModule,
    DialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
  providers: [MessageService]
})
export class RecipesComponent {

  recipes: Recipes[] = [];

  recipe: Recipes = {};

  selectedRecipes: Recipes[] = [];

  patients: Patients[] = [];

  //Abrir el formulario 
  RecipeDialog: boolean = false;

  isEditing: boolean = false;

  submitted: boolean = false;

  deleteRecipesDialog: boolean = false;

  deleteRecipeDialog: boolean = false;

  formsrecipes!: FormGroup;

  constructor(
    private recipesService: RecipesService,
    private patientsService: PatientsService,
    private messageService: MessageService,
    private fb: FormBuilder

  ) { }

  ngOnInit(): void {
    this.listRecipes();
    this.listPatients();

    // Inicializar el formulario con validaciones
    this.formsrecipes = this.fb.group({
      recipe_date: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      indications: ['', [Validators.required]],
      patients_idpatients: ['', [Validators.required]]

    });    

  }

  openNew() {
    this.recipe = {
    };

    this.isEditing = false; // Establecer que no es edición
    this.submitted = false;
    this.formsrecipes.reset(); //
    this.RecipeDialog = true;
  }

  hideDialog() {
    this.RecipeDialog = false;
    this.submitted = false;
  }

  listRecipes() {
    this.recipesService.getRecipeslist().subscribe({
      next: (res) => {
        this.recipes = res.map(recipe => ({
          ...recipe,
          recipe_date: recipe.recipe_date ? recipe.recipe_date.split('T')[0] : null
        }));
        console.log('Recetas con fechas formateadas:', this.recipes);
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
    return patient ? patient.name_patients : 'N/A'; // Devuelve 'N/A' si no se encuentra 
  }

  
  editRecipe(selectedRecipe: Recipes) {
    console.log('🔵 Receta seleccionada para editar:', selectedRecipe);
  
    if (!selectedRecipe || !selectedRecipe.id) {
      console.error('❌ ERROR: La receta seleccionada no tiene un ID válido.');
      return;
    }
  
    // Asignar receta seleccionada al objeto this.recipe
    this.recipe = { 
      ...selectedRecipe,
      recipe_date: selectedRecipe.recipe_date ? selectedRecipe.recipe_date.split('T')[0] : null
    };
  
    console.log('🟢 ID de la receta que se está editando:', this.recipe.id);
  
    this.isEditing = true; // Activar modo edición
  
    this.formsrecipes.patchValue({
      id: this.recipe.id,  // 🔥 Asegurar que el ID esté en el formulario
      recipe_date: this.recipe.recipe_date,
      description: this.recipe.description,
      indications: this.recipe.indications,
      patients_idpatients: this.recipe.patients_idpatients
    });
  
    this.RecipeDialog = true;
  }
  
  saveRecipe() {
    this.submitted = true;
  
    if (this.formsrecipes.invalid) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete correctamente todos los campos del formulario',
        life: 3000  // Duración del mensaje
      });
      return;
    }
  
    // 🔥 Mantener el ID de la receta si existe
    const formValues = this.formsrecipes.value;
    this.recipe = {
      ...formValues,
      id: this.recipe.id || formValues.id, // 🔥 Asegurar que el ID no se pierda
    };
  
    if (this.recipe.recipe_date) {
      this.recipe.recipe_date = new Date(this.recipe.recipe_date).toISOString().split('T')[0];
    }
  
    console.log('🔎 Verificando ID antes de guardar:', this.recipe.id);
  
    if (this.recipe.id) {
      console.log('✏️ Actualizando receta con ID:', this.recipe.id);
      
      this.recipesService.updateRecipes(this.recipe.id, this.recipe).subscribe({
        next: (updatedRecipe) => {
          const index = this.recipes.findIndex((s) => s.id === updatedRecipe.id);
          if (index !== -1) {
            this.recipes[index] = updatedRecipe;
          }
  
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Receta Actualizada Correctamente',
          });
  
          this.listRecipes();
          this.RecipeDialog = false;
          this.recipe = {};
        },
        error: (e) => {
          console.error('❌ Error al actualizar la receta:', e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un error al actualizar la receta',
          });
        },
      });
    } else {
      console.log('🆕 Creando nueva receta');
      
      this.recipesService.createRecipes(this.recipe).subscribe({
        next: (newRecipe) => {
          this.recipes.push(newRecipe);
          console.log('🆕 Creando nueva receta'+ newRecipe);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Receta Guardada Correctamente',
          });
  
          this.listRecipes();
          this.RecipeDialog = false;
          this.recipe = {};
        },
        error: (e) => {
          console.error('❌ Error al guardar la receta:', e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un error al guardar la receta',
          });
        },
      });
    }
  }
  
  
  




  
  
  
  deleteRecipe(recipe: Recipes) {
    this.recipe = { ...recipe };  
    this.deleteRecipesDialog = true; 
  }

  confirmDelete() {
    // Llamar al servicio para eliminar 
    this.recipesService.deleteRecipesId(this.recipe.id).subscribe({
      next: () => {
        // Eliminar de la lista 
        this.recipes = this.recipes.filter(recipes => recipes.id !== this.recipe.id);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Receta Eliminada',
          life: 3000
        });

        this.recipe = {};

        // Cerrar el cuadro de diálogo de eliminación
        this.deleteRecipesDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar La Receta',
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

 // Componente Angular
downloadRecetaPdf(id: number): void {
  this.recipesService.downloadPdf(id).subscribe({
    next: (pdfBlob: Blob) => {
      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(pdfBlob);
      link.href = url;
      link.download = `recipes-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url); // Liberar el objeto URL
    },
    error: (e) => {
      console.error("Error descargando el PDF:", e);
    }
  });
}


   // Método para eliminar
   deleteSelectedRecipes() {
    if (this.selectedRecipes.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione las recetas que desea eliminar.',
        life: 3000
      });
      return;
    }
    this.deleteRecipeDialog = true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación 
  confirmDeleteSelected() {
    const selectedIds = this.selectedRecipes.map(species => species.id);

    // Llamar al servicio para eliminar 
    this.recipesService.deleteSelectedRecipes(selectedIds).subscribe({
      next: () => {
        // Eliminar 
        this.recipes = this.recipes.filter(recipes => !this.selectedRecipes.includes(recipes));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Recetas Eliminadas Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedRecipes = [];
        this.deleteRecipeDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar las recetas seleccionadas.',
          life: 3000
        });
        console.error(e);
      }
    });
  }


}
