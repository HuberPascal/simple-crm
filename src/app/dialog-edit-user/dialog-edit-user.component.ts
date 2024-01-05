import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user.class';
import { Firestore } from '@angular/fire/firestore';
import { doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrl: './dialog-edit-user.component.scss',
})
export class DialogEditUserComponent {
  user: User = new User();
  // userId: string | undefined;
  loading: boolean = false;
  userId: string | null = '';
  birthDate!: Date;

  constructor(
    public dialogRef: MatDialogRef<DialogEditUserComponent>,
    public db: Firestore
  ) {}

  // Daten in Firebase aktualisieren
  async saveUser() {
    this.loading = true;
    // this.user.birthDate = this.birthDate.getTime();

    const userData = this.user.toJSON();
    const firebaseData = doc(this.db, 'users', `${this.userId}`);

    await updateDoc(firebaseData, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      birthDate: userData.birthDate,
    });
    this.loading = false;
    this.dialogRef.close();
  }
}
