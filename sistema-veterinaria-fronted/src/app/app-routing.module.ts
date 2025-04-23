import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { authGuard } from './guards/auth.guard';
import { LogoutComponent } from './demo/components/logout/logout.component';
import { SendEmailComponent } from './demo/components/auth/send-email/send-email.component';
import { ChangePasswordComponent } from './demo/components/auth/change-password/change-password.component';
import { RegistrationComponent } from './demo/components/authentication/registration/registration.component';
import { UserComponent } from './demo/components/user/user.component';
import { VerificationComponent } from './demo/components/verification/verification.component';

@NgModule({

    
    imports: [
        
        RouterModule.forRoot([
            
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [authGuard]}, // Protege el acceso},
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) , canActivate: [authGuard]},
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule), canActivate: [authGuard] },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule), canActivate: [authGuard] },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule), canActivate: [authGuard] },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) , canActivate: [authGuard]}
                ]
            },

            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            {
                path: 'email-password/sendemail',
                component: SendEmailComponent,
            },

            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            
            { path: 'notfound', component: NotfoundComponent },
            {
                path: 'register', 
                component:RegistrationComponent
            },
            {
                path: 'logout', 
                component:LogoutComponent
            },

            {
                path: 'change-password/:tokenPassword',
                component: ChangePasswordComponent,
            },

            { path: 'verify', 
                component: VerificationComponent
            },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
