import { Component, OnInit } from '@angular/core';
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
    private readonly authSvr: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
    console.log('Estado inicial del formulario:', this.createEventForm.value);
    this.onEventTypeSelected;
  }

  async onEventTypeSelected(type: string) {
    this.selectedEventType = type;
    this.typeEvent.setValue(type); // Actualiza el valor del FormControl
    console.log('Tipo de evento seleccionado:', type);
  }

  async onSubmit() {
    if (this.createEventForm.valid) {
      const formValues = this.createEventForm.value;
      const currentUser = await this.authSvr.getCurrentUser();

      // Crear el objeto de evento
      const newEvent: IEvent = {
        creatorID: currentUser.uid, // ID del creador
        currentAttendees: '', // Inicialmente vacío
        date: formValues.date,
        description: formValues.description,
        direccion: formValues.direccion,
        duration: formValues.duration,
        eventID: '', // Se generará automáticamente
        numberOfAttendees: formValues.numberOfAttendees, // Inicialmente 0
        specialRequirements: formValues.specialRequirements,
        typeEvent: formValues.typeEvent,
      };

      try {
        // Simular el guardado del evento
        await this.saveEvent(newEvent);
        console.log('Evento creado con éxito');
        await this.router.navigate(['/home']); // Redirigir al inicio
      } catch (error) {
        console.error('Error al crear el evento:', error);
      }
    } else {
      console.log('Formulario inválido:', this.createEventForm);
    }
  }

  private initForm() {
    // Inicializa el FormGroup y los controles
    this.createEventForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      specialRequirements: new FormControl('', [Validators.required]),
      numberOfAttendees: new FormControl('',[Validators.required]),
      typeEvent: new FormControl(''),
    });

    // Asigna los controles del FormGroup a las propiedades
    this.date = this.createEventForm.get('date') as FormControl;
    this.description = this.createEventForm.get('description') as FormControl;
    this.direccion = this.createEventForm.get('direccion') as FormControl;
    this.duration = this.createEventForm.get('duration') as FormControl;
    this.specialRequirements = this.createEventForm.get(
      'specialRequirements'
    ) as FormControl;
    this.typeEvent = this.createEventForm.get('typeEvent') as FormControl;
    this.numberOfAttendees = this.createEventForm.get('numberOfAttendees') as FormControl
  }

  // Simula guardar el evento (debe ser reemplazado con lógica real)
  private async saveEvent(event: IEvent) {
    console.log('Guardando evento:', event);
    // Aquí podrías integrar la lógica de Firebase o base de datos.
  }
}