import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardService } from './shared/guard/guard.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [GuardService] 
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)

  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [GuardService] 
  },
  {
    path: 'event',
    loadChildren: () => import('./pages/event/event/event.module').then( m => m.EventPageModule),
    canActivate: [GuardService] 
  },
  {
    path: 'update',
    loadChildren: () => import('./pages/update/update/update.module').then( m => m.UpdatePageModule),
    canActivate: [GuardService] 
  },
  {
    path: 'update-event',
    loadChildren: () => import('./pages/update-event/update-event.module').then( m => m.UpdateEventPageModule),
    canActivate: [GuardService] 
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
