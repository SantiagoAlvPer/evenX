import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { IEvent } from '../../interfaces/ievent';
import { BehaviorSubject, from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private selectedEventId = new BehaviorSubject<string | null>(null);
  private readonly collection: string = 'IEvents';

  constructor(
    private readonly fireStore: AngularFirestore,
    private readonly authSvr: AuthService,

  ) {}



  // Obtener todos los eventos
  getAllEvents(): Observable<any[]> {
    return this.fireStore
      .collection('IEvents') // Sin filtro para obtener todos los eventos
      .valueChanges({ idField: 'id' }); // `idField` agrega el ID del documento a los datos
  }

  
  // Obtener eventos del usuario autenticado
  getUserEvents(): Observable<any[]> {
    return this.authSvr.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          throw new Error('Usuario no autenticado');
        }
        return this.fireStore
        .collection('IEvents', (ref) =>
          ref.where('creatorID', '==', user.uid)
          )
          .snapshotChanges()
          .pipe(
            map((changes) =>
              changes.map((change) => {
                const data = change.payload.doc.data() as Record<string, any>;
                const id = change.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      })
    );
  }


  async createEvent(event: IEvent): Promise<string> {
    try {
      const currentUserUID = await this.authSvr.currentID();
  
      if (!currentUserUID) {
        throw new Error('No se pudo obtener el UID del usuario autenticado');
      }
  
      // Asignar el UID como creatorID
      event.creatorID = currentUserUID;
  
      const eventRef = this.fireStore.collection('IEvents');
      const docRef = await eventRef.add(event);
      event.eventID = docRef.id;
  
      // Actualizar el documento con el eventID
      await eventRef.doc(docRef.id).update({ eventID: docRef.id });
  
      console.log('Evento guardado con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar el evento en Firestore:', error);
      throw error;
    }
  }


  setSelectedEventId(eventID: string): void {
    this.selectedEventId.next(eventID);
  }
  
  getSelectedEventId(): Observable<string | null> {
    return this.selectedEventId.asObservable();
  }
  
  getEventById(eventID: string): Observable<IEvent | undefined> {
    return this.fireStore
      .collection('IEvents')
      .doc<IEvent>(eventID)
      .valueChanges()
      .pipe(
        map((event) => (event ? { ...event, eventID } : undefined))
      );
  }

   // Método para actualizar un evento
  async updateEvent(event: IEvent): Promise<void> {
    return this.fireStore
      .collection(this.collection)
      .doc(event.eventID) // Usamos el ID del evento para localizarlo
      .update(event) // Actualizamos el documento con los nuevos datos
      .then(() => {
        console.log('Evento actualizado con éxito');
      })
      .catch((error) => {
        console.error('Error al actualizar el evento:', error);
        throw error;
      });
  }

  
 async deleteEvent(eventID: string): Promise<void> {
    return this.fireStore
      .collection(this.collection)
      .doc(eventID)
      .delete();
  }
}
