import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/controllers/loading/loading.service';
import { ToastService } from 'src/app/shared/controllers/toast/toast.service';
import { IUser } from 'src/app/shared/interfaces/iuser';
import { AuthService } from 'src/app/shared/service/auth/auth.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  selectedUserType: string = '';
  public name!: FormControl;
  public lastName!: FormControl;
  public typeUser!: FormControl;
  public phone!: FormControl;
  public birthDate!: FormControl;
  public email!: FormControl;
  public updateForm!: FormGroup;
  public currentUserId: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly authSvr: AuthService,
    private readonly loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUserData();
  }

  private async loadUserData() {
    try {
      const userData = await this.authSvr.getCurrentUser();
      if (userData) {
        this.currentUserId = userData.uid;
        this.updateForm.patchValue(userData); // Llena el formulario con los datos actuales
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  async onUserTypeSelected(type: string) {
    this.selectedUserType = type;
  }

  async onSubmit() {
    if (this.updateForm.valid) {
      await this.loadingService.show('Actualizando usuario...'); // Mostrar spinner
      const updatedUserData: IUser = {
        ...this.updateForm.value,
        uid: this.currentUserId!,  
      };
  
      try {
        await this.authSvr.updateUser(updatedUserData);
        console.log('Usuario actualizado correctamente');
  
        await this.toastService.presentToast('Usuario actualizado con éxito', true);
  
        await this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
  
        await this.toastService.presentToast(
          'Error al actualizar el usuario. Inténtalo de nuevo',
          false
        );
      } finally {
        await this.loadingService.dismiss();
      }
    } else {
      console.warn('Formulario inválido');

      await this.toastService.presentToast(
        'Por favor, completa todos los campos correctamente',
        false
      );
    }
  }


  private initForm() {
    this.updateForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      typeUser: new FormControl(''),
      birthDate: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.name = this.updateForm.get('name') as FormControl;
    this.lastName = this.updateForm.get('lastName') as FormControl;
    this.typeUser = this.updateForm.get('typeUser') as FormControl;
    this.phone = this.updateForm.get('phone') as FormControl;
    this.birthDate = this.updateForm.get('birthDate') as FormControl;
    this.email = this.updateForm.get('email') as FormControl;
  }
}
