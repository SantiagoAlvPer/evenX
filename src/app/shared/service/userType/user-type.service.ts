import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserTypeService {
  private userTypes = ['Admin', 'User', 'Manager', 'Empresa'];

  getUserTypes(): string[] {
    return this.userTypes;
  }
}