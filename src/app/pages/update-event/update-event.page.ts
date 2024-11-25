import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IEvent } from 'src/app/shared/interfaces/ievent';
import { EventService } from 'src/app/shared/service/event/event.service';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.page.html',
  styleUrls: ['./update-event.page.scss'],
})
export class UpdateEventPage implements OnInit {
  public date!: FormControl;
  public description!: FormControl;
  public direccion!: FormControl;
  public duration!: FormControl;
  public specialRequirements!: FormControl;
  public typeEvent!: FormControl;
  public numberOfAttendees!: FormControl;
  public updateEventForm!: FormGroup;

  selectedEventType: string = '';
  private eventID: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly eventService: EventService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadSelectedEvent();
  }
  
  onEventTypeSelected(eventType: string) {
    console.log('Tipo de evento seleccionado:', eventType);
    this.selectedEventType = eventType; // Actualiza la variable con el tipo de evento seleccionado
  }
  

  private initForm() {
    this.updateEventForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      specialRequirements: new FormControl('', [Validators.required]),
      numberOfAttendees: new FormControl('', [Validators.required]),
      typeEvent: new FormControl(''),
    });

    // Asignar controles
    this.date = this.updateEventForm.get('date') as FormControl;
    this.description = this.updateEventForm.get('description') as FormControl;
    this.direccion = this.updateEventForm.get('direccion') as FormControl;
    this.duration = this.updateEventForm.get('duration') as FormControl;
    this.specialRequirements = this.updateEventForm.get('specialRequirements') as FormControl;
    this.typeEvent = this.updateEventForm.get('typeEvent') as FormControl;
    this.numberOfAttendees = this.updateEventForm.get('numberOfAttendees') as FormControl;
  }

  private loadSelectedEvent() {
    this.eventService.getSelectedEventId().subscribe((id) => {
      this.eventID = id;
      if (this.eventID) {
        this.eventService.getEventById(this.eventID).subscribe((event) => {
          if (event) {
            this.updateEventForm.patchValue(event);
          } else {
            console.error('Evento no encontrado');
          }
        });
      } else {
        console.error('El ID del evento no está definido');
      }
    });
  }

  async onUpdateSubmit() {
    if (this.updateEventForm.valid && this.eventID) {
      const updatedEvent: IEvent = {
        ...this.updateEventForm.value,
        eventID: this.eventID,
      };

      try {
        await this.eventService.updateEvent(updatedEvent);
        console.log('Evento actualizado exitosamente');
        this.router.navigate(['/profile']); // Redirigir al perfil
      } catch (error) {
        console.error('Error al actualizar el evento:', error);
      }
    } else {
      console.error('Formulario inválido o ID de evento faltante');
    }
  }
}

