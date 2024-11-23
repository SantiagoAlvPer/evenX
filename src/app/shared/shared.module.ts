import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input/input.component';
import { ButtonComponent } from './components/button/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserTypeComponent } from './components/userType/user-type/user-type.component';
import { EventTypeListComponent } from './components/event-type-list/event-type-list.component';
const Components = [
  InputComponent,
  ButtonComponent,
  UserTypeComponent,
  EventTypeListComponent
];


@NgModule({
  declarations: [...Components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [ReactiveFormsModule,
    ...Components],
})
export class SharedModule { }
