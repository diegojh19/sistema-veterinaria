import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpeciesComponent } from '../species/species.component';
import { BreedsComponent } from '../breeds/breeds.component';
import { CustomerComponent } from '../customer/customer.component';
import { PatientsComponent } from '../patients/patients.component';
import { ShiftsComponent } from '../shifts/shifts.component';
import { QueriesComponent } from '../queries/queries.component';
import { DiagnosisComponent } from '../diagnosis/diagnosis.component';
import { TreatmentsComponent } from '../treatments/treatments.component';
import { CategoriesComponent } from '../categories/categories.component';
import { RecipesComponent } from '../recipes/recipes.component';
import { ExamsComponent } from '../exams/exams.component';
import { ProductsComponent } from '../products/products.component';
import { UserComponent } from '../user/user.component';
import { RegistrationComponent } from '../authentication/registration/registration.component';
import { LoginComponent } from '../auth/login/login.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LogoutComponent } from '../logout/logout.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'button', data: { breadcrumb: 'Button' }, loadChildren: () => import('./button/buttondemo.module').then(m => m.ButtonDemoModule) },
        { path: 'charts', data: { breadcrumb: 'Charts' }, loadChildren: () => import('./charts/chartsdemo.module').then(m => m.ChartsDemoModule) },
        { path: 'file', data: { breadcrumb: 'File' }, loadChildren: () => import('./file/filedemo.module').then(m => m.FileDemoModule) },
        { path: 'floatlabel', data: { breadcrumb: 'Float Label' }, loadChildren: () => import('./floatlabel/floatlabeldemo.module').then(m => m.FloatlabelDemoModule) },
        { path: 'formlayout', data: { breadcrumb: 'Form Layout' }, loadChildren: () => import('./formlayout/formlayoutdemo.module').then(m => m.FormLayoutDemoModule) },
        { path: 'input', data: { breadcrumb: 'Input' }, loadChildren: () => import('./input/inputdemo.module').then(m => m.InputDemoModule) },
        { path: 'invalidstate', data: { breadcrumb: 'Invalid State' }, loadChildren: () => import('./invalid/invalidstatedemo.module').then(m => m.InvalidStateDemoModule) },
        { path: 'list', data: { breadcrumb: 'List' }, loadChildren: () => import('./list/listdemo.module').then(m => m.ListDemoModule) },
        { path: 'media', data: { breadcrumb: 'Media' }, loadChildren: () => import('./media/mediademo.module').then(m => m.MediaDemoModule) },
        { path: 'message', data: { breadcrumb: 'Message' }, loadChildren: () => import('./messages/messagesdemo.module').then(m => m.MessagesDemoModule) },
        { path: 'misc', data: { breadcrumb: 'Misc' }, loadChildren: () => import('./misc/miscdemo.module').then(m => m.MiscDemoModule) },
        { path: 'overlay', data: { breadcrumb: 'Overlay' }, loadChildren: () => import('./overlays/overlaysdemo.module').then(m => m.OverlaysDemoModule) },
        { path: 'panel', data: { breadcrumb: 'Panel' }, loadChildren: () => import('./panels/panelsdemo.module').then(m => m.PanelsDemoModule) },
        { path: 'table', data: { breadcrumb: 'Table' }, loadChildren: () => import('./table/tabledemo.module').then(m => m.TableDemoModule) },
        { path: 'tree', data: { breadcrumb: 'Tree' }, loadChildren: () => import('./tree/treedemo.module').then(m => m.TreeDemoModule) },
        { path: 'menu', data: { breadcrumb: 'Menu' }, loadChildren: () => import('./menus/menus.module').then(m => m.MenusModule) },
        
        {
            path: 'species', 
            component: SpeciesComponent
        },
        {
            path: 'breeds', 
            component: BreedsComponent
        },
        {
            path: 'customer', 
            component: CustomerComponent
        },

        {
            path: 'patients', 
            component: PatientsComponent
        },

        {
            path: 'shifts', 
            component: ShiftsComponent
        },

        {
            path: 'queries', 
            component: QueriesComponent
        },
        {
            path: 'diagnosis', 
            component: DiagnosisComponent
        },
        {
            path: 'treatments', 
            component: TreatmentsComponent
        },
        {
            path: 'categories', 
            component: CategoriesComponent
        },

        {
            path: 'recipes', 
            component: RecipesComponent
        },

        {
            path: 'exams', 
            component: ExamsComponent
        },

        {
            path: 'products', 
            component: ProductsComponent
        },

        {
            path: 'users', 
            component: UserComponent
        },

        {
            path: 'registration', 
            component: RegistrationComponent
        },
        
    
    
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UIkitRoutingModule { }
