import { Component } from '@angular/core';
import { AuthService } from '../../shared/service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private readonly authSrv: AuthService
    ,private router: Router
  ) {}


  public async LogOut() {

    this.authSrv.logOut().then(() => {
      // Redirige o navega después de cerrar sesión
      console.log('Sesión cerrada');

    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}
