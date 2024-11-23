import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserTypeService } from 'src/app/shared/service/userType/user-type.service';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.scss'],
})
export class UserTypeComponent  implements OnInit {
  @Input() control!: FormControl;
  @Output() userTypeSelected = new EventEmitter<string>();
  userTypes: string[] = [];

  constructor(private userTypeService: UserTypeService) {}

  ngOnInit() {
    this.userTypes = this.userTypeService.getUserTypes();
  }

  onUserTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.userTypeSelected.emit(selectElement.value);
  }
}