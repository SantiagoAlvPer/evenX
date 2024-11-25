import { AuthService } from '../../shared/service/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/shared/controllers/loading/loading.service';
import { ToastService } from 'src/app/shared/controllers/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  public loginForm: FormGroup;

  constructor(
    private readonly authSvr: AuthService,
    private readonly navCtrl: NavController,
    private readonly loadingService: LoadingService, 
    private toastService: ToastService

  ) {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit() {}

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      try {
        await this.loadingService.show('Iniciando sesión...');
        await this.authSvr.logInWithEmailAndPassword(email, password);
        await this.toastService.presentToast('Inicio de sesión exitoso', true);
        this.navCtrl.navigateForward('home');
      } catch (error) {
        console.error('Error iniciando sesión:', error);
        await this.toastService.presentToast('Error al iniciar sesión. Inténtalo de nuevo.', false);
      } finally {
        await this.loadingService.dismiss();
      }
    } else {
      await this.toastService.presentToast('Por favor, completa todos los campos correctamente.', false);
      console.log('Formulario inválido');
    }
  }
}

