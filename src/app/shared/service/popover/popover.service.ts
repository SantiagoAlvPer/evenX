import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopOverComponent } from '../../components/pop-over/pop-over.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {
  constructor(
    private popoverController: PopoverController,
    private router: Router,
    private readonly authSvr: AuthService
  ) { }

  ngOnInit() {}

  async openPopover(event: Event, options: { label: string; action: string }[]) {
    const popover = await this.popoverController.create({
      component: PopOverComponent,
      event,
      translucent: true,
      componentProps: { options }, // Pasar opciones al componente Popover
    });

    await popover.present();
    const { data } = await popover.onDidDismiss();
    
    // Maneja la acción seleccionada y realiza la redirección o el logOut
    if (data?.action) {
      this.handleAction(data.action); // Llamar al manejador de acción
    }
  }

  private handleAction(action: string) {
    if (action === 'updateUser') {
      // Redirige a la página de actualización de usuario
      this.router.navigate(['/update']);
    } else if (action === 'logout') {
      // Lógica para el cierre de sesión
      this.authSvr.logOut().then(() => {
        console.log('Usuario deslogueado correctamente');
        // Redirigir a la página de login después de desloguearse
        this.router.navigate(['/login']);
      }).catch(error => {
        console.log('Error al cerrar sesión', error);
      });
    }
  }
}

