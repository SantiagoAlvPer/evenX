import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/controllers/loading/loading.service';
import { ToastService } from 'src/app/shared/controllers/toast/toast.service';
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
    private readonly eventService: EventService,
    private readonly loadingService: LoadingService,
    private toastService: ToastService
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
      specialRequirements: new FormControl('null',),
      numberOfAttendees: new FormControl('null',),
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

  private async loadSelectedEvent() {
    try {
      await this.loadingService.show('Cargando evento...');
      this.eventService.getSelectedEventId().subscribe((id) => {
        this.eventID = id;
        if (this.eventID) {
          this.eventService.getEventById(this.eventID).subscribe((event) => {
            if (event) {
              this.updateEventForm.patchValue(event);
            } else {
              console.error('Evento no encontrado');
            }
            this.loadingService.dismiss(); 
          });
        } else {
          console.error('El ID del evento no está definido');
          this.loadingService.dismiss();
        }
      });
    } catch (error) {
      console.error('Error al cargar el evento:', error);
      this.loadingService.dismiss();
    }
  }

  //mtodo para actualizar los datos del evento 
  async onUpdateSubmit() {
    if (this.updateEventForm.valid && this.eventID) {
      const updatedEvent: IEvent = {
        ...this.updateEventForm.value,
        eventID: this.eventID,
      };
  
      try {
        await this.loadingService.show('Actualizando evento...'); 
        await this.eventService.updateEvent(updatedEvent);
        await this.toastService.presentToast('Evento actualizado exitosamente', true);
        console.log('Evento actualizado exitosamente');
        this.router.navigate(['/profile']);
      } catch (error) {
        console.error('Error al actualizar el evento:', error);
        await this.toastService.presentToast(
          'Error al actualizar el evento. Inténtalo de nuevo.',
          false
        );
      } finally {
        await this.loadingService.dismiss(); 
      }
    } else {
      console.error('Formulario inválido o ID de evento faltante');
  
      await this.toastService.presentToast(
        'Por favor, completa todos los campos correctamente.',
        false
      );
    }
  }
}

