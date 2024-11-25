import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventTypeService {
  private eventTypes = [
' boda ',
'cumpleaños',
'aniversario',
'baby shower',
'despedida de soltero/a',
'reunión familiar',
'bautizo',
'comunión',
'confirmación',
'festival',
'concierto',
'feria',
'fiesta local',
'graduación',
'congreso',
'celebración temática',
];

  getEventTypes(): string[] {
    return this.eventTypes;
  }
}
