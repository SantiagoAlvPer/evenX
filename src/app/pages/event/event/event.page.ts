import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IEvent } from 'src/app/shared/interfaces/ievent';
import { AuthService } from 'src/app/shared/service/auth/auth.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  selectedEventType: string = '';

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
    private readonly authSvr: AuthService,
    private readonly firestore: AngularFirestore, // Inyectar AngularFirestore
  ) {}

  

  ngOnInit() {
    this.initForm();
    console.log('Estado inicial del formulario:', this.createEventForm.value);
    
  }
  

  onEventTypeSelected(eventType: string) {
    console.log('Tipo de evento seleccionado:', eventType);
    this.selectedEventType = eventType; // Actualiza la variable con el tipo de evento seleccionado
  }



  async onSubmit() {
    if (this.createEventForm.valid) {
      const formValues = this.createEventForm.value;
      const currentUserUID = await this.authSvr.currentID();
      const newEvent: IEvent = {
        creatorID: currentUserUID, // El creatorID será asignado dentro del servicio
        date: formValues.date,
        description: formValues.description,
        direccion: formValues.direccion,
        duration: formValues.duration,
        eventID: '', // El eventID será generado por Firestore
        numberOfAttendees: formValues.numberOfAttendees,
        specialRequirements: formValues.specialRequirements,
        typeEvent: formValues.typeEvent,
      };

      try {
        await this.saveEvent(newEvent); // Llama a saveEvent para guardar el evento en Firestore
        console.log('Evento creado con éxito');
        await this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al crear el evento:', error);
      }
    } else {
      console.log('Formulario inválido:', this.createEventForm.value);
    }
  }



  private async saveEvent(event: IEvent): Promise<string> {
    try {
      const eventRef = this.firestore.collection("IEvents");

      // Agregar el evento y obtener la referencia del documento creado
      const docRef = await eventRef.add(event);

      // Asignar el ID generado automáticamente por Firestore al campo eventID
      event.eventID = docRef.id;

      // Actualizar el documento con el campo eventID
      await eventRef.doc(docRef.id).update({ eventID: docRef.id });

      console.log('Evento guardado con ID:', docRef.id);

      return docRef.id; // Retornar el ID del evento
    } catch (error) {
      console.error('Error al guardar el evento en Firestore:', error);
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
    this.specialRequirements = this.createEventForm.get(
      'specialRequirements'
    ) as FormControl;
    this.typeEvent = this.createEventForm.get('typeEvent') as FormControl;
    this.numberOfAttendees = this.createEventForm.get(
      'numberOfAttendees'
    ) as FormControl;
  }
}