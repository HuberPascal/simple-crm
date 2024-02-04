import { Component } from '@angular/core';
import { User } from '../../models/user.class';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { AuthService } from '../services/firebase-auth.service';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss',
})
export class DialogAddUserComponent {
  user = new User();
  birthDate!: Date;
  loading: boolean = false;
  isEmailValid: boolean = true;
  ismail: boolean = true;
  email: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    public db: Firestore,
    private userService: UserService,
    private authService: AuthService
  ) {}

  async saveUser() {
    this.user.birthDate = this.birthDate.getTime();
    console.log('current user is', this.user);
    this.loading = true;
    let docRef: any;

    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    try {
      const userData = this.user.toJSON();

      if (isAnonymous) {
        // Für Gastbenutzer in der "guest_users"-Sammlung speichern
        firebaseData = collection(this.db, 'guest_users');
        docRef = await addDoc(firebaseData, userData);
        console.log(
          `Added JSON document with ID in Guest Collection: ${docRef.id}`
        );
      } else {
        // Für registrierte Benutzer in der "users"-Sammlung speichern
        firebaseData = collection(this.db, 'users');
        docRef = await addDoc(firebaseData, userData);
        console.log(`Added JSON document with ID: ${docRef.id}`);
      }
    } catch (error) {
      console.error('Fehler beim Schreiben der Dokumente (JSON):', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }

  isSaveButtonDisabled(): boolean {
    return (
      !this.user.firstName ||
      !this.user.lastName ||
      !this.user.email ||
      !this.birthDate ||
      !this.user.street ||
      !this.user.zipCode ||
      !this.user.city ||
      !this.validateMail()
    );
  }

  validateMail() {
    // E-Mail-Validierung
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.user.email);
    this.isEmailValid = emailPattern;

    if (this.isEmailValid) {
      this.ismail = true;
    } else {
      this.ismail = false;
    }
    return this.isEmailValid;
  }
}
