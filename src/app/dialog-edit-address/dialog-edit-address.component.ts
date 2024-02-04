import { Component } from '@angular/core';
import { User } from '../../models/user.class';
import { MatDialogRef } from '@angular/material/dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../services/firebase-auth.service';

@Component({
  selector: 'app-dialog-edit-address',
  templateUrl: './dialog-edit-address.component.html',
  styleUrl: './dialog-edit-address.component.scss',
})
export class DialogEditAddressComponent {
  user: User = new User();
  userId: string | null = '';
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditAddressComponent>,
    public db: Firestore,
    private authService: AuthService
  ) {}

  // Daten in Firebase aktualisieren
  async saveUser() {
    this.loading = true;
    const userData = this.user.toJSON();
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

    let firebaseData;

    if (isAnonymous) {
      firebaseData = doc(this.db, 'guest_users', `${this.userId}`);
    } else {
      firebaseData = doc(this.db, 'users', `${this.userId}`);
    }

    await updateDoc(firebaseData, {
      street: userData.street,
      zipCode: userData.zipCode,
      city: userData.city,
    });
    this.loading = false;
    this.dialogRef.close();
  }
}
