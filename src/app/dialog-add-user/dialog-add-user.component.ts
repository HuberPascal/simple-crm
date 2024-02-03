import { Component } from '@angular/core';
import { User } from '../../models/user.class';
import { AngularFireModule } from '@angular/fire/compat';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  onSnapshot,
} from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { SignInComponent } from '../sign-in/sign-in.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss',
})
export class DialogAddUserComponent {
  user = new User();
  birthDate!: Date;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    public db: Firestore,
    private userService: UserService
  ) {}

  async saveUser() {
    this.user.birthDate = this.birthDate.getTime();
    console.log('current user is', this.user);
    this.loading = true;

    try {
      const userData = this.user.toJSON();

      if (this.userService.isGuestUser) {
        // Für Gastbenutzer in der "guest_users"-Sammlung speichern
        const docRef = await addDoc(
          collection(this.db, 'guest_users'),
          userData
        );
        console.log(
          `Added JSON document with ID in Guest Collection: ${docRef.id}`
        );
      } else {
        // Für registrierte Benutzer in der "users"-Sammlung speichern
        const docRef = await addDoc(collection(this.db, 'users'), userData);
        console.log(`Added JSON document with ID: ${docRef.id}`);
      }
    } catch (error) {
      console.error('Fehler beim Schreiben der Dokumente (JSON):', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }
}
