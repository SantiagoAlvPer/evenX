import { IUser } from './../../interfaces/iuser';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private readonly authSvr: AngularFireAuth,
    private readonly fireStore: AngularFirestore,
    private router: Router
  ) {
    // Escucha el estado de autenticación de Firebase
    this.authSvr.authState.subscribe(user => {
      this.isAuthenticatedSubject.next(!!user);  // Actualiza el estado con true si el usuario está autenticado
    });
  }
// Método para obtener los datos del usuario actual
async getCurrentUser(): Promise<any> {
  try {
    // Obtiene el usuario autenticado actual desde el servicio de autenticación
    const currentUser = await this.authSvr.currentUser;
    if (currentUser?.uid) {
      // Accede al documento correspondiente al UID del usuario en Firestore
      const userDoc = await this.fireStore.collection('IUser').doc(currentUser.uid).get().toPromise();

      if (userDoc?.exists) {
        // Si el documento existe, devuelve los datos del usuario
        return userDoc.data();
      } else {
        throw new Error('Datos del usuario no encontrados en Firestore');
      }
    } else {
      throw new Error('Usuario no autenticado');
    }
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw error;
  }
}
  // Método para obtener el estado de autenticación actual
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
  // Iniciar sesión con correo y contraseña
  async logInWithEmailAndPassword(email: string, password: string): Promise<void> {
    try {
      await this.authSvr.signInWithEmailAndPassword(email, password);
      this.isAuthenticatedSubject.next(true);
      console.log('Usuario autenticado con éxito');

      // Redirigir a home si no está ya en esa ruta
      if (this.router.url !== '/home') {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.isAuthenticatedSubject.next(false);
      throw error; // Lanza el error para manejarlo en el componente si es necesario
    }
  }


  // Registrar un nuevo usuario
  async doRegister(email: string, password: string, userData: IUser): Promise<void> {
    try {
      // Registrar el usuario con correo y contraseña
      const userCredential = await this.authSvr.createUserWithEmailAndPassword(email, password);

      const uid = userCredential.user?.uid;
      if (uid) {
        // Si se obtiene un UID, asignarlo al objeto userData
        userData.uid = uid;

        // Almacenar los datos del usuario en Firestore
        await this.fireStore.collection('IUser').doc(uid).set(userData);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;  // Opcional: puedes lanzar el error para manejarlo en el lugar que llame a este método
    }
  }

  // Cerrar sesión
  async logOut(): Promise<void> {
    try {
      await this.authSvr.signOut();
      this.isAuthenticatedSubject.next(false);
      console.log('Sesión cerrada');

      // Redirigir a login si no está ya en esa ruta
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
