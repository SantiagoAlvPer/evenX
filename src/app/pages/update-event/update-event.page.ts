import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IEvent } from 'src/app/shared/interfaces/ievent';
import { AuthService } from 'src/app/shared/service/auth/auth.service';
import { EventService } from 'src/app/shared/service/event/event.service';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.page.html',
  styleUrls: ['./update-event.page.scss'],
})
export class UpdateEventPage implements OnInit {
  selectedEventType: string = '';
  eventID: string = '';  // Guardamos el eventID aquí

  public date!: FormControl;
  public description!: FormControl;
  public direccion!: FormControl;
  public duration!: FormControl;
  public specialRequirements!: FormControl;
  public typeEvent!: FormControl;
  public numberOfAttendees!: FormControl;
  public createEventForm!: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly eventService: EventService,  
  ) {}

  ngOnInit() {
    this.initForm();
    this.eventID = 'eventoID-aqui'; 

    // Cargar los datos del evento al iniciar
    this.loadEventData();
  }

  private loadEventData() {
    this.eventService.getEventById(this.eventID).subscribe((event) => {
      if (event) {
        this.createEventForm.patchValue({
          date: event.date,
          description: event.description,
          direccion: event.direccion,
          duration: event.duration,
          specialRequirements: event.specialRequirements,
          numberOfAttendees: event.numberOfAttendees,
          typeEvent: event.typeEvent,
        });
        this.selectedEventType = event.typeEvent;
      } else {
        console.error('Evento no encontrado');
      }
    });
  }

  async onSubmit() {
    if (this.createEventForm.valid) {
      const formValues = this.createEventForm.value;
      const updatedEvent: IEvent = {
        eventID: this.eventID,  
        date: formValues.date,
        description: formValues.description,
        direccion: formValues.direccion,
        duration: formValues.duration,
        specialRequirements: formValues.specialRequirements,
        typeEvent: formValues.typeEvent,
        numberOfAttendees: formValues.numberOfAttendees,
        creatorID: 'currentUserUID', 
      };

      try {
        await this.updateEvent(updatedEvent);
        console.log('Evento actualizado con éxito');
        await this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al actualizar el evento:', error);
      }
    } else {
      console.log('Formulario inválido:', this.createEventForm.value);
    }
  }

  private async updateEvent(event: IEvent): Promise<void> {
    try {
      await this.eventService.updateEvent(event);
      console.log('Evento actualizado en Firestore');
    } catch (error) {
      console.error('Error al actualizar el evento en Firestore:', error);
      throw error;
    }
  }

  private initForm() {
    this.createEventForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      specialRequirements: new FormControl('', [Validators.required]),
      numberOfAttendees: new FormControl('', [Validators.required]),
      typeEvent: new FormControl(''),
    });

    this.date = this.createEventForm.get('date') as FormControl;
    this.description = this.createEventForm.get('description') as FormControl;
    this.direccion = this.createEventForm.get('direccion') as FormControl;
    this.duration = this.createEventForm.get('duration') as FormControl;
    this.specialRequirements = this.createEventForm.get('specialRequirements') as FormControl;
    this.typeEvent = this.createEventForm.get('typeEvent') as FormControl;
    this.numberOfAttendees = this.createEventForm.get('numberOfAttendees') as FormControl;
  }
} 

