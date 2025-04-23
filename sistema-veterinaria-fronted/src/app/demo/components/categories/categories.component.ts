import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Categories } from '../../api/categories';
import { CategoriesService } from '../../service/categories.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-categories',
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
    ReactiveFormsModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  providers: [MessageService]

})
export class CategoriesComponent {

  categories: Categories[] = [];

  categorie: Categories = {};

  selectedCategories: Categories[] = [];

    //Abrir el formulario 
    categoriesDialog: boolean = false;

    isEditing: boolean = false;
  
    submitted: boolean = false;

    deleteCategoriesDialog: boolean = false;

    deleteCategorieDialog: boolean = false;

    formscategory!: FormGroup;

  constructor(
    private categoriesService:CategoriesService,
    private messageService: MessageService,
    private fb: FormBuilder

  ){}

  ngOnInit(): void {
    this.listCategories();  // Llamar al servicio para obtener la lista 

     // Inicializar el formulario con validaciones
     this.formscategory = this.fb.group({

      name_category: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]]
    });
  }

  openNew() {
    this.categorie = {};
    this.isEditing = false; // Establecer que no es edición
    this.formscategory.reset(); //
    this.submitted = false;
    this.categoriesDialog = true;
  }

  hideDialog() {
    this.categoriesDialog = false;
    this.submitted = false;
  }

  listCategories() {
    this.categoriesService.getCategorieslist().subscribe({
      next: (res) => {
        this.categories = res;
        console.log("categories", this.categories);
      },
      error: (e) => {
        console.error(e);
      }
    });

  }
  saveCategory() {
    this.submitted = true;

    if (this.formscategory.invalid) {
      this.messageService.clear();
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Por favor, complete correctamente todos los campos del formulario',
        life: 3000  // Duración del mensaje
      });
      return;
    }
 // Asignar los valores del formulario al objeto `categorie`
 this.categorie = { ...this.categorie, ...this.formscategory.value }

      if (this.categorie.id) {
     
        this.categoriesService.updateCategories(this.categorie.id, this.categorie).subscribe({
          next: (updatedCategory) => {
            const index = this.categories.findIndex((s) => s.id === updatedCategory.id);
            if (index !== -1) {
              this.categories[index] = updatedCategory;
            }

            // Mostrar mensaje de éxito
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Categoria Actualizada Correctamente',
            });

            this.listCategories();

            // Cerrar el diálogo y limpiar el formulario
            this.categoriesDialog = false;
            this.categorie = {}; // Limpiar formulario 
          },
          error: (e) => {
            console.error('Error Al Actualizar La Categoria', e);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Hubo Un Error Al Actualizar La Categoria',
            });
          },
        });
      } else {
        // Si no tiene un ID, se trata de una creación
        this.categoriesService.createCategories(this.categorie).subscribe({
          next: (res) => {
            this.categories.push(res);

            // Mostrar mensaje de éxito
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Categoria Guardada Correctamente',
            });

            // Actualizar la lista 
            this.listCategories();

            // Cerrar el diálogo y limpiar el formulario
            this.categoriesDialog = false;
            this.categorie = {}; // Limpiar formulario 
          },
          error: (e) => {
            console.error('Error Al Guardar La Categoria', e);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Hubo Un Error Al Guardar La Categoria',
            });
          },
        });
      }
    
  }

  editCategory(categories: Categories) {
    this.categorie = { ...categories };  
    this.isEditing = true; 
    this.categoriesDialog = true;  
  
    // Actualizar el formulario con los datos de la categoría seleccionada
    this.formscategory.patchValue({
      name_category: this.categorie.name_category
    });
  }
  

  // Mostrar el cuadro de diálogo de eliminación
  deleteCustomer(categories: Categories) {
    this.categorie = { ...categories };  
    this.deleteCategoriesDialog = true; 
  }

  confirmDelete() {
    this.categoriesService.deleteCategoriesId(this.categorie.id).subscribe({
      next: () => {
        // Eliminar de la lista 
        this.categories = this.categories.filter(categorie => categorie.id !== this.categorie.id);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Categoria Eliminada',
          life: 3000
        });

        this.categorie = {};

        // Cerrar el cuadro de diálogo de eliminación
        this.deleteCategoriesDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar La Categoria',
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
  deleteSelectedCategories() {
    if (this.selectedCategories.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione las categorias que desea eliminar.',
        life: 3000
      });
      return;
    }
    this.deleteCategorieDialog = true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación 
  confirmDeleteSelected() {
    const selectedIds = this.selectedCategories.map(species => species.id);

    // Llamar al servicio para eliminar 
    this.categoriesService.deleteSelectedCategories(selectedIds).subscribe({
      next: () => {
        // Eliminar 
        this.categories = this.categories.filter(categories => !this.selectedCategories.includes(categories));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categorias Eliminadas Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedCategories = [];
        this.deleteCategorieDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar las categorias seleccionadas.',
          life: 3000
        });
        console.error(e);
      }
    });
  }
}
