import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Products } from '../../api/products';
import { ProductsService } from '../../service/products.service';
import { CategoriesService } from '../../service/categories.service';
import { Categories } from '../../api/categories';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-products',
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
    DropdownModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [MessageService]
})
export class ProductsComponent {

  //Abrir Formulario
  productsDialog: boolean = false;
  //Abrir Para Eliminar 1
  deleteProductsDialog: boolean = false;
  //Abrir Para Eliminar varios
  deleteProductDialog: boolean = false;

  products: Products = {};

  submitted: boolean = false;

  product: Products[] = [];

  categories: Categories[] = [];

  isEditing: boolean = false;

  selectedProducts: Products[] = [];

  filteredProducts: any[] = [];

  formsProducts!: FormGroup;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.Productslist();  // Llamar al servicio para obtener la lista 
    this.listCategories();
    // Inicializar el formulario con validaciones
    this.formsProducts = this.fb.group({
      id: [null],  // Añadido para almacenar el id
      name_products: ['', [Validators.required]],
      description: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      stock: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      expiration_Date: ['', [Validators.required ]],
      dose: ['', [Validators.required ]],
      categories_idcategories: ['', [Validators.required]]
    });
    
  }

  openNew() {
    this.products = {};
    this.isEditing = false; // Establecer que no es edición
    this.submitted = false;
    this.formsProducts.reset(); //
    this.productsDialog = true;
  }

  hideDialog() {
    this.productsDialog = false;
    this.submitted = false;
  }

  Productslist() {
    this.productsService.getProductslist().subscribe({
      next: (res) => {
        this.product = res;
        console.log("aqui", this.product);
      },
      error: (e) => {
        console.error(e);
      }
    });

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

  editProduct(product: Products) {
    console.log('Producto a editar:', product);  // Verifica que el producto tiene el id
  
    if (product && product.id) {
      this.isEditing = true;  // Establecer que estamos en modo edición
      this.submitted = false; // Restablecer el estado de validación
  
      // Convertir la fecha de vencimiento a formato compatible con el input de fecha
      const expirationDate = product.expiration_Date ? new Date(product.expiration_Date).toISOString().split('T')[0] : '';
  
      // Rellenar el formulario con los datos del producto
      this.formsProducts.patchValue({
        id: product.id,
        name_products: product.name_products,
        description: product.description,
        brand: product.brand,
        price: product.price,
        stock: product.stock,
        expiration_Date: expirationDate,  // Asegúrate de pasar la fecha correctamente
        dose: product.dose,
        categories_idcategories: product.categories_idcategories
      });
  
      console.log('Formulario después de patchValue:', this.formsProducts.value);  // Verifica si los datos son correctos
      console.log('Formulario ID:', this.formsProducts.get('id')?.value); // Verificar que el ID se asignó correctamente
  
      // Mostrar el formulario de edición
      this.productsDialog = true;
    } else {
      console.error('El producto no tiene un ID válido para editar');
    }
  }
  
  
  
  saveProducts() {
    this.submitted = true;
  
    // Verificar si el formulario es válido antes de continuar
    if (this.formsProducts.invalid) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario Incompleto',
        detail: 'Por favor, complete correctamente todos los campos del formulario',
        life: 3000
      });
      return;
    }
  
    // Asegurarse de que el id esté en el formulario
    console.log('Producto a guardar:', this.formsProducts.value);
  
    const product = this.formsProducts.value;
    // Verificar si el producto tiene un ID
    if (product.id) {
      // Si tiene un ID, es una edición
      this.productsService.updateProduct(product.id, product).subscribe({
        next: (updatedProduct) => {
          const index = this.product.findIndex((p) => p.id === updatedProduct.id);
          if (index !== -1) {
            this.product[index] = updatedProduct;  // Actualizamos el producto en la lista
          }
  
          // Mostrar mensaje de éxito
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto Actualizado Correctamente',
            life: 3000
          });
  
          this.Productslist();  // Recargar la lista de productos
          this.productsDialog = false;  // Cerrar el diálogo
          this.products = {};  // Limpiar el formulario
        },
        error: (e) => {
          console.error('Error al actualizar el producto', e);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un error al actualizar el producto',
            life: 3000
          });
        }
      });
    } else {
      // Si no tiene ID, es una creación de nuevo producto
      this.productsService.createProduct(product).subscribe({
        next: (newProduct) => {
          this.product.push(newProduct);  // Añadir el nuevo producto a la lista
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto Guardado Correctamente',
            life: 3000
          });
  
          this.Productslist();  // Recargar la lista de productos
          this.productsDialog = false;  // Cerrar el diálogo
          this.products = {};  // Limpiar el formulario
        },
        error: (e) => {
          console.error('Error al guardar el producto', e);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un error al guardar el producto',
            life: 3000
          });
        }
      });
    }
  }
  
  
  
  
  
  getCustomerName(categories_idcategories: number): string {
    const customers = this.categories.find(s => s.id === categories_idcategories);  // Usamos 'this.customer' aquí
    return customers ? customers.name_category : 'N/A'; // Devuelve 'N/A' si no se encuentra el cliente
  }


  deleteProducts(products: Products) {
    this.products = { ...products };  // Asignar el producto a eliminar a this.products
    this.deleteProductsDialog = true;  // Mostrar el cuadro de diálogo de eliminación
  }
  

  confirmDelete() {
    // Llamar al servicio para eliminar 
    this.productsService.deleteProductById(this.products.id).subscribe({
      next: () => {
        // Eliminar de la lista 
        this.product = this.product.filter(product => product.id !== this.products.id);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Producto Eliminado',
          life: 3000
        });

        this.products = {};

        // Cerrar el cuadro de diálogo de eliminación
        this.deleteProductsDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar El Producto',
          life: 3000
        });
        console.error(e);
      }
    });
  }

  
   // Método para eliminar
   deleteSelectedProducts() {
    if (this.selectedProducts.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione los productos que desea eliminar.',
        life: 3000
      });
      return;
    }
    this.deleteProductDialog = true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación 
  confirmDeleteSelected() {
    const selectedIds = this.selectedProducts.map(species => species.id);

    // Llamar al servicio para eliminar 
    this.productsService.deleteSelectedProducts(selectedIds).subscribe({
      next: () => {
        // Eliminar 
        this.product = this.product.filter(product => !this.selectedProducts.includes(product));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Productos Eliminados Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedProducts = [];
        this.deleteProductDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar los productos seleccionados.',
          life: 3000
        });
        console.error(e);
      }
    });
  }
  

}
