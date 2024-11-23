import { AuthService } from '../../shared/service/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

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
        await this.authSvr.logInWithEmailAndPassword(email, password); 

        this.navCtrl.navigateForward('home');

      } catch (error) {

        console.error('Error logging in:', error);
      }
    } else {
      console.log('Invalid form');

    }
  }
}
