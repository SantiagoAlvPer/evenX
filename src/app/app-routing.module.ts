import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'event',
    loadChildren: () => import('./pages/event/event/event.module').then( m => m.EventPageModule)
  },
  {
    path: 'update',
    loadChildren: () => import('./pages/update/update/update.module').then( m => m.UpdatePageModule)
  },
  {
    path: 'update-event',
    loadChildren: () => import('./pages/update-event/update-event.module').then( m => m.UpdateEventPageModule)
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
