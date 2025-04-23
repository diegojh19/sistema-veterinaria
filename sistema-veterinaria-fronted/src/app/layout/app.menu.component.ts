import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Components',
                items: [
                    { label: 'Especies', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/species'] },
                    { label: 'Razas', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/breeds'] },
                    { label: 'Clientes', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/customer'] },
                    { label: 'Categorias', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/categories'] },
                    { label: 'Pacientes', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/patients'] },
                    { label: 'Turnos', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/shifts'] },
                    { label: 'Consultas', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/queries'] },
                    { label: 'Diagnoticos', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/diagnosis'] },
                    { label: 'Tratamientos', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/treatments'] },
                    { label: 'Recetas', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/recipes'] },
                    { label: 'Examenes', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/exams'] },
                    { label: 'Productos', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/products'] },
                    { label: 'usuarios', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/users'] },
                    { label: 'registrar', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/registration'] },


                ]
            },
           
           
            
        ];
    }
}
