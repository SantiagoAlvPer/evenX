import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    try {
      this.user = await this.authService.getCurrentUser();
      console.log('Usuario obtenido:', this.user);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  }
}



