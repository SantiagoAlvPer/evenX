import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private readonly loadingCtrl: LoadingController) { }

  public async show(message: string = 'Please wait...') {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null
    });
    await loading.present();

    const loadingElement = document.querySelector('ion-loading .loading-wrapper');
    if (loadingElement) {
      loadingElement.innerHTML = `
    <div class="loader">
      <div class="form1">
        <div class="square"></div>
        <div class="square"></div>
      </div>
      <div class="form2">
        <div class="square"></div>
        <div class="square"></div>
      </div>
    </div>
      `;
    }
  }

  public async dismiss() {
    await this.loadingCtrl.dismiss();
  }
}
