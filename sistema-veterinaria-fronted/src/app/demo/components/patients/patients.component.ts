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
import { Patients } from '../../api/patients';
import { PatientsService } from '../../service/patients.service';
import { Breeds } from '../../api/breeds';
import { BreedsService } from '../../service/breeds.service';
import { Customer } from '../../api/customer';
import { CustomerService } from '../../service/customer.service';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { Species } from '../../api/species';
import { SpeciesService } from '../../service/species.service';


@Component({
  selector: 'app-patients',
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
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss',
  providers: [MessageService]
})
export class PatientsComponent {

  patients: Patients[] = [];

  patient: Patients = {};

  selectedPatient: Patients[] = [];

  breed: Breeds[] = [];

  customer: Customer[] = [];

  species: Species[] = [];

  
  //Abrir el formulario 
  patientsDialog: boolean = false;

  isEditing: boolean = false;

  submitted: boolean = false;

  deletePatientsDialog: boolean = false;

  deletePatientDialog: boolean = false;

  selectFile: File | null = null;     // Archivo seleccionado
  imagePreview: string | ArrayBuffer | null = null; // Para mostrar la vista previa de la imagen seleccionada

  formspatient!: FormGroup;

  imageSizeError = false;
  imageTypeError = false;
  maxSize = 5 * 1024 * 1024; // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  constructor(
    private patientsService:PatientsService,
    private breedService:BreedsService,
    private customerService:CustomerService,
    private messageService: MessageService,
    private speciesService:SpeciesService,
    private fb: FormBuilder

  ){}

  ngOnInit(): void {
    this.listPatients();  // Llamar al servicio para obtener la lista 
    this.getbreed();
    this.getCustomer();
    this.getSpecies();

    
     // Inicializar el formulario con validaciones
     this.formspatient = this.fb.group({
      name_patients: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      birthdate: ['', [Validators.required ]],
      age: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      sex: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      color: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      fur: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      allergy: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      photo_patients: [''],
      breeds_idbreeds: ['', Validators.required],
      customer_idcustomer: ['', Validators.required],

    });


  }

  openNew() {
    this.patient = {};
    this.isEditing = false; // Establecer que no es edición
    this.submitted = false;
    this.formspatient.reset(); //
    this.patientsDialog = true;
  }

  
  resetDialog() {
    this.selectFile = undefined;
    this.imagePreview = null;
    this.patient = {}; 
    this.submitted = false;
  }

  hideDialog() {
    this.patientsDialog = false;
    this.resetDialog(); // Llama al método de limpieza
  }

// Función para formatear la fecha al formato yyyy-MM-dd.
formatDate(date: string | Date | undefined): string | undefined {
  if (!date) return undefined;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}
  
editPatients(patients: Patients) {
  this.patient = { ...patients };  
  this.patient.birthdate = this.formatDate(this.patient.birthdate);
  this.isEditing = true;
  this.patientsDialog = true;

  // Llenar el formulario con los datos del paciente seleccionado
  this.formspatient.patchValue({
    name_patients: this.patient.name_patients,
    birthdate: this.patient.birthdate,
    age: this.patient.age,
    sex: this.patient.sex,
    color: this.patient.color,
    fur: this.patient.fur,
    allergy: this.patient.allergy,
    photo_patients: this.patient.photo_patients,
    breeds_idbreeds: this.patient.breeds_idbreeds,
    customer_idcustomer: this.patient.customer_idcustomer
  });

  // Si hay una imagen, mostrarla en la vista previa
  if (this.patient.photo_patients) {
    this.imagePreview = this.patient.photo_patients;
  }
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

  getbreed() {
    this.breedService.getBreedslist().subscribe({
      next: (data) => {
        console.log('Datos obtenidos de Breed:', data);
        this.breed = data;
      },
      error: (e) => {
        console.error('Error al obtener Breed:', e);
      },
    });
  }

  getSpecies() {
    this.speciesService.getSpecieslist().subscribe({
      next: (data) => {
        console.log('Datos obtenidos de Species:', data);
        this.species = data;
      },
      error: (e) => {
        console.error('Error al obtener Species:', e);
      },
    });
  }

  getBreedName(breeds_idbreeds: number): string {
    // Buscar en el array 'this.breed' que es donde están almacenadas las razas
    const breed = this.breed.find(s => s.id === breeds_idbreeds);  // Usamos 'this.breed' aquí
    return breed ? breed.name_breeds : 'N/A'; // Devuelve 'N/A' si no se encuentra la raza
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
    // Buscar en el array 'this.customer' que es donde están almacenadas los clientes
    const customers = this.customer.find(s => s.id === customer_idcustomer);  // Usamos 'this.customer' aquí
    return customers ? customers.name_customer : 'N/A'; // Devuelve 'N/A' si no se encuentra el cliente
  }

  getSelectedBreedsName(): string {
    const selectedbreeds = this.breed.find(breeds => breeds.id === this.patient.breeds_idbreeds);
    return selectedbreeds ? selectedbreeds.name_breeds : '';
  }

  getSelectedCustomerName(): string {
    const selectedcustomer = this.customer.find(customers => customers.id === this.patient.customer_idcustomer);
    return selectedcustomer ? selectedcustomer.name_customer : '';
  }

  savePatients() {
    this.submitted = true;

    
        // Forzar que todos los campos del formulario se marquen como "tocados" y "sucios"
        if (this.formspatient.invalid) {
          Object.values(this.formspatient.controls).forEach(control => {
              control.markAsTouched();
              control.markAsDirty();
          });
          this.messageService.clear();
          this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Por favor, complete correctamente todos los campos del formulario',
              life: 3000  // Duración del mensaje
          });
    
          return;
      }

    const formData = new FormData();
    formData.append('id', this.patient.id?.toString() || '0');
    formData.append('name_patients', this.formspatient.value.name_patients);
    formData.append('photo_patients', this.formspatient.value.photo_patients);
    formData.append('birthdate', this.formspatient.value.birthdate.toString());
    formData.append('age', this.formspatient.value.age);
    formData.append('sex', this.formspatient.value.sex);
    formData.append('color', this.formspatient.value.color);
    formData.append('fur', this.formspatient.value.fur);
    formData.append('allergy', this.formspatient.value.allergy);
    formData.append('breeds_idbreeds', this.formspatient.value.breeds_idbreeds.toString());
    formData.append('customer_idcustomer', this.formspatient.value.customer_idcustomer.toString());


    if (this.selectFile) {
      formData.append('image', this.selectFile ||'');
    }

    if (this.isEditing) {
              // Si el paciente tiene un ID, se trata de una edición
        this.patientsService.updatePatients(this.patient.id, formData).subscribe({
          next: (updatedPatients) => {
            const index = this.patients.findIndex((s) => s.id === updatedPatients.id);
            if (index !== -1) {
              this.patients[index] = updatedPatients;
            }

            // Mostrar mensaje de éxito
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Paciente Actualizado Correctamente',
            });

            // Actualizar la lista 
            this.listPatients();

            // Cerrar el diálogo y limpiar el formulario
            this.patientsDialog = false;
            this.patient = {}; // Limpiar formulario 
          },
          error: (e) => {
            console.error('Error Al Actualizar El Paciente', e);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Hubo Un Error Al Actualizar El Paciente',
            });
          },
        });
      } else {
        // Si no tiene un ID, se trata de una creación
        this.patientsService.createPatients(formData).subscribe({
          next: (res) => {
            this.patients.push(res);

            // Mostrar mensaje de éxito
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Paciente Guardado Correctamente',
            });

            this.listPatients();

            // Cerrar el diálogo y limpiar el formulario
            this.patientsDialog = false;
            this.patient = {}; // Limpiar formulario 
          },
          error: (e) => {
            console.error('Error Al Guardar El Paciente', e);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Hubo Un Error Al Guardar EL Paciente',
            });
          },
        });
      }
    
  }

   // Mostrar el cuadro de diálogo de eliminación
   deletePatients(patients: Patients) {
    this.patient = { ...patients };  
    this.deletePatientsDialog = true; 
  }

  confirmDelete() {
    
    this.patientsService.deletePatientsId(this.patient.id).subscribe({
      next: () => {
       // this.patient.photo_patients = updatedPatients.photo_patients;
        // Si estás utilizando una tabla, también puedes hacer esto para actualizar el estado de la tabla:
        this.patients = this.patients.filter(patients => patients.id !== this.patient.id);

        this.patients = [...this.patients]; // Esto forzará la actualización de la tabla

        // Eliminar de la lista 

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Paciente Eliminado',
          life: 3000
        });

        this.patient = {};

        // Cerrar el cuadro de diálogo de eliminación
        this.deletePatientsDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Al Eliminar El Paciente',
          life: 3000
        });
        console.error(e);
      }
    });
  }

  
    // Método para manejar la selección de archivo de imagen
    onFileSelect(event: any): void {
      this.selectFile = event.target.files[0];
    
      // Resetear errores previos
      this.imageTypeError = false;
      this.imageSizeError = false;
    
      // Verificar si un archivo fue seleccionado
      if (this.selectFile) {
        // Validar el tipo de archivo (solo imágenes)
        if (!this.allowedTypes.includes(this.selectFile.type)) {
          this.imageTypeError = true; // Mostrar error de tipo
          this.selectFile = null; // Limpiar archivo seleccionado
          this.imagePreview = null; // Limpiar vista previa
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Solo se permiten archivos de imagen (JPEG, PNG, GIF).'
          });
          return;
        }
    
        // Validar el tamaño del archivo
        if (this.selectFile.size > this.maxSize) {
          this.imageSizeError = true; // Mostrar error de tamaño
          this.selectFile = null; // Limpiar archivo seleccionado
          this.imagePreview = null; // Limpiar vista previa
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El archivo debe ser de 5 MB o menos.'
          });
          return;
        }
    
        // Si la imagen es válida, mostrar vista previa
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result; // Asigna la imagen al campo imagePreview
        };
        reader.readAsDataURL(this.selectFile); // Lee el archivo como URL
      }
    }
    

    removeImage(): void {
      this.selectFile = null;       // Elimina el archivo seleccionado
      this.imagePreview = null;     // Limpia la vista previa
      this.patient.photo_patients = null; // Restablece el valor del modelo asociado
  }
  

  getSpeciesByBreed(breedId: number): string {
    console.log('Buscando especie para la raza con id: ', breedId);
  
    // Encuentra la raza correspondiente
    const breed = this.breed.find(b => b.id === breedId);
    console.log('Raza encontrada: ', breed);
  
    if (breed) {
      // Verifica el species_id de la raza
      console.log('ID de la especie en la raza:', breed.speciesId);
  
      // Encuentra la especie usando el species_id de la raza
      const species = this.species.find(s => s.id === breed.speciesId);
      console.log('Especie encontrada: ', species);
  
      if (species) {
        return species.name_species;  // Retorna el nombre de la especie
      } else {
        console.log('No se encontró la especie con ID:', breed.speciesId);
        return 'Especie desconocida';
      }
    } else {
      console.log('Raza no encontrada');
      return 'Raza no encontrada';
    }
  }
  
  onGlobalFilter(dt: any, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    dt.filterGlobal(value, 'contains');
  }

  // Método para eliminar
  deleteSelectedPatients() {
    if (this.selectedPatient.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione los pacientes que desea eliminar.',
        life: 3000
      });
      return;
    }
    this.deletePatientDialog= true; // Abrir el cuadro de diálogo de confirmación
  }

  // Confirmar eliminación 
  confirmDeleteSelected() {
    const selectedIds = this.selectedPatient.map(species => species.id);

    // Llamar al servicio para eliminar 
    this.patientsService.deleteSelectedPatients(selectedIds).subscribe({
      next: () => {
        // Eliminar 
        this.patients = this.patients.filter(patients => !this.selectedPatient.includes(patients));

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Pacientes Eliminados Correctamente',
          life: 3000
        });

        // Limpiar la selección y cerrar el cuadro de diálogo
        this.selectedPatient = [];
        this.deletePatientDialog = false;
      },
      error: (e) => {
        // Mostrar mensaje de error si falla la eliminación
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar los pacientes seleccionadas.',
          life: 3000
        });
        console.error(e);
      }
    });
  }
}
