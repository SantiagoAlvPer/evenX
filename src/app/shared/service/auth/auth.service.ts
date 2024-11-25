import { IUser } from './../../interfaces/iuser';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$: Observable<{ uid: string; email: string } | null>;

  constructor(
    private readonly authSvr: AngularFireAuth,
    private readonly fireStore: AngularFirestore,
    private router: Router
  ) {
    // Escucha el estado de autenticación de Firebase
    this.authSvr.authState.subscribe(user => {
      this.isAuthenticatedSubject.next(!!user);  // Actualiza el estado con true si el usuario está autenticado
    });

    this.currentUser$ = this.authSvr.authState.pipe(
      map((user) =>
        user
          ? { uid: user.uid, email: user.email || '' } // Validamos que exista el usuario
          : null
      )
    );
  }

  userIsAuthenticated(): Observable<boolean> {
    return new Observable((observer) => {
      this.authSvr.authState.subscribe((user) => {
        observer.next(!!user); 
      });
    });
  }
  async getAuthenticatedUserId(): Promise<string | null> {
    const user = await this.authSvr.currentUser;
    return user ? user.uid : null;
  }


  async getCurrentuser(): Promise<{ uid: string; email: string } | null> {
    try {
      const currentUser = await this.authSvr.currentUser;
      return currentUser
        ? { uid: currentUser.uid, email: currentUser.email || '' }
        : null;
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return null;
    }
  }

 async getCurrentUser(): Promise<any> {
    try {
      const currentUser = await this.authSvr.currentUser;
      if (currentUser?.uid) {
        const userDoc = await this.fireStore.collection('IUser').doc(currentUser.uid).get().toPromise();
        if (userDoc?.exists) {
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
   // Método para obtener el UID del usuario autenticado
   currentID(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authSvr.currentUser.then(user => {
        if (user) {
          resolve(user.uid); // Devuelve el UID del usuario
        } else {
          reject('No hay usuario autenticado');
        }
      });
    });
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

  async updateUser(userData: IUser): Promise<void> {
    try {
      const userRef = this.fireStore.collection('IUser').doc(userData.uid);
      await userRef.update(userData);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
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
