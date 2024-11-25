import { PopoverService } from './../../shared/service/popover/popover.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/service/auth/auth.service';
import { Router } from '@angular/router';
import { EventService } from 'src/app/shared/service/event/event.service';
import { IEvent } from 'src/app/shared/interfaces/ievent';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  allEvents: any[] = [];

  constructor(
    private readonly authSrv: AuthService
    ,private router: Router
    ,private readonly eventSvr: EventService
    ,private readonly PopoverSvr: PopoverService
  ) {}

  ngOnInit() {
    this.eventSvr.getAllEvents().subscribe(
      (events) => {
        this.allEvents = events; // Datos actualizados en tiempo real
      },
      (error) => console.error('Error al obtener eventos:', error)
    );
  }

  async showPopover(event: Event) {
    const options = [
      { label: 'Log Out', action: 'logout' },
      { label: 'Update User', action: 'updateUser' },
    ];
    const action = await this.PopoverSvr.openPopover(event, options);
    console.log('Acción seleccionada:', action);
  }
}
  


