import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private readonly router: Router

  ) {}

  async ngOnInit() {
    try {
      this.user = await this.authService.getCurrentUser();
      console.log('Usuario obtenido:', this.user);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }

    this.loadUserEvents()
  }


 // Cargar eventos del usuario autenticado
 loadUserEvents() {
  this.eventSvr.getUserEvents().subscribe({
    next: (events) => (this.userEvents = events),
    error: (error) =>
      console.log('eventos del usuario no encontrados', error)
  });
}

goToUpdateEvent(eventID: string) {
  this.eventSvr.setSelectedEventId(eventID);
this.router.navigate(['/update-event']);
}

  deleteEvent(eventID: string) {
    this.eventSvr.deleteEvent(eventID).then(() => {
      console.log(`Evento ${eventID} eliminado con éxito`);
    }).catch((err) => {
      console.error('Error al eliminar el evento:', err);
    });
  }

  
}



