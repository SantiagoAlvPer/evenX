import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth/auth.service';
import { IUser } from '../../shared/interfaces/iuser';
import { LoadingService } from 'src/app/shared/controllers/loading/loading.service';
import { ToastService } from 'src/app/shared/controllers/toast/toast.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  selectedUserType: string = '';
  isEditMode: boolean = false; // Determina si estamos en modo actualización
  currentUserId: string | null = null; // UID del usuario actual

  public name!: FormControl;
  public lastName!: FormControl;
  public typeUser!: FormControl;
  public phone!: FormControl;
  public birthDate!: FormControl
  public email!: FormControl;
  public password!: FormControl;
  public signupForm!: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly authSvr: AuthService,
    private readonly loadingService: LoadingService,
    private toastService: ToastService
  ) { }

  ngOnInit() {

    this.initForm();
    console.log('Estado inicial del formulario:', this.signupForm.value)
    this.onUserTypeSelected
  }

async  onUserTypeSelected(type: string){
    this.selectedUserType = type;
    console.log('Tipo de usuario seleccionado:', type);
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      const formValues = this.signupForm.value;
  

      const userData: IUser = {
        name: formValues.name,
        lastName: formValues.lastName,
        typeUser: formValues.type,
        birthDate: formValues.birthDate,
        phone: formValues.phone,
        email: formValues.email,
        uid: '', 
      };
  
      try {

        await this.loadingService.show('Registrando usuario...');
        
        await this.authSvr.doRegister(
          formValues.email,
          formValues.password,
          userData
        );
  
        console.log('Usuario registrado correctamente');
        
        await this.toastService.presentToast('Usuario registrado con éxito', true);

        await this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        
        await this.toastService.presentToast(
          'Hubo un error al registrar el usuario',
          false
        );
      } finally {

        await this.loadingService.dismiss();
      }
    } else {
      console.log('Formulario inválido:', this.signupForm.value);
      
      await this.toastService.presentToast(
        'Por favor, completa todos los campos correctamente',
        false
      );
    }
  }

  private initForm() {
    // Inicializa el FormGroup y todos los controles directamente
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      type: new FormControl('',),
      birthDate: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  
    // Asigna los controles del FormGroup a las propiedades
    this.name = this.signupForm.get('name') as FormControl;
    this.lastName = this.signupForm.get('lastName') as FormControl;
    this.typeUser = this.signupForm.get('type') as FormControl;
    this.phone = this.signupForm.get('phone') as FormControl;
    this.birthDate = this.signupForm.get('birthDate') as FormControl;
    this.email = this.signupForm.get('email') as FormControl;
    this.password = this.signupForm.get('password') as FormControl;
  }

}
