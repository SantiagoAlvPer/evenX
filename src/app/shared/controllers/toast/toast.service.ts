import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async presentToast(message: string, success: boolean, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: success ? 'success' : 'danger', 
      icon: success ? 'checkmark-circle' : 'close-circle', 
      position: 'bottom', 
    });
    toast.present();
  }
}
