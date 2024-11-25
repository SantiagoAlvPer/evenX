import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/controllers/loading/loading.service';
import { ToastService } from 'src/app/shared/controllers/toast/toast.service';
import { IEvent } from 'src/app/shared/interfaces/ievent';
import { AuthService } from 'src/app/shared/service/auth/auth.service';
import { EventService } from 'src/app/shared/service/event/event.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userEvents: any[] = [];
  user: any;
  errorMessage: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly eventSvr: EventService,
    private readonly router: Router,
    private readonly loadingService: LoadingService,
    private toastService: ToastService

  ) { }

  async ngOnInit() {
    try {
      await this.loadingService.show('Cargando usuario...');
      this.user = await this.authService.getCurrentUser();
      console.log('Usuario obtenido:', this.user);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      await this.toastService.presentToast('Error al obtener el usuario', false);
    } finally {
      await this.loadingService.dismiss();
    }

    this.loadUserEvents();
  }


  // Cargar eventos del usuario autenticado
  async loadUserEvents() {
 try {
      this.eventSvr.getUserEvents().subscribe({
        next: (events) => {
          this.userEvents = events;
          console.log('Eventos cargados:', this.userEvents);
          this.toastService.presentToast('Eventos cargados con éxito', true); // Mensaje de éxito
        },
        error: (error) => {
          console.error('Eventos del usuario no encontrados:', error);
          this.toastService.presentToast(
            'No se pudieron cargar los eventos del usuario',
            false
          );
        },
      });
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      await this.toastService.presentToast(
        'Error al cargar los eventos',
        false
      ); 
    }
  }

  goToUpdateEvent(eventID: string) {
    this.eventSvr.setSelectedEventId(eventID);
    this.router.navigate(['/update-event']);
  }

  async deleteEvent(eventID: string) {
    try {
      await this.loadingService.show('Eliminando evento...');
      await this.eventSvr.deleteEvent(eventID);
      console.log(`Evento ${eventID} eliminado con éxito`);

      // Actualizar la lista de eventos después de la eliminación
      this.userEvents = this.userEvents.filter(
        (event) => event.eventID !== eventID
      );

      // Mensaje de éxito
      await this.toastService.presentToast(
        'Evento eliminado con éxito',
        true
      );
    } catch (err) {
      console.error('Error al eliminar el evento:', err);

      // Mensaje de error
      await this.toastService.presentToast(
        'Error al eliminar el evento',
        false
      );
    } finally {
      await this.loadingService.dismiss();
    }
  }
}



