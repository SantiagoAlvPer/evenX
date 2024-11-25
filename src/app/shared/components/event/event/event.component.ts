import { Component, OnInit } from '@angular/core';
import { IEvent } from 'src/app/shared/interfaces/ievent';
import { EventService } from 'src/app/shared/service/event/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent  implements OnInit {
  allEvents: any[] = [];
  userEvents: any[] = [];
  errorMessage: string = '';

  constructor(
    private readonly eventSvr: EventService
  
  ) { }

  ngOnInit() {
    this.eventSvr.getAllEvents().subscribe(
      (events) => {
        this.allEvents = events;
      },
      (error) => console.error('Error al obtener todos los eventos:', error)
    );
  }
  }
  
