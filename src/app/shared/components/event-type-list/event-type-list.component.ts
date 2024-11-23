import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventTypeService } from '../../service/eventType/event-type.service';

@Component({
  selector: 'app-event-type-list',
  templateUrl: './event-type-list.component.html',
  styleUrls: ['./event-type-list.component.scss'],
})
export class EventTypeListComponent  implements OnInit {
  @Input() control!: FormControl;
  @Output() eventTypeSelected = new EventEmitter<string>();
  eventTypes: string[] = [];

  constructor(private readonly eventTypeService: EventTypeService) {}

  ngOnInit() {
    this.eventTypes = this.eventTypeService.getEventTypes();
    console.log('Tipos de eventos cargados:', this.eventTypes); // <--- Verifica los datos
  }

 async onUserTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
  
    // Actualiza el control directamente
    if (this.control) {
      this.control.setValue(selectedValue);
    }
  
    // Emitir el evento para que el padre también lo reciba
    this.eventTypeSelected.emit(selectedValue);
  }
}

