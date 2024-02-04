import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { deleteDoc, doc } from 'firebase/firestore';
import { User } from '../../models/user.class';
import { AuthService } from '../services/firebase-auth.service';

@Component({
  selector: 'app-dialog-delete-user',
  templateUrl: './dialog-delete-user.component.html',
  styleUrl: './dialog-delete-user.component.scss',
})
export class DialogDeleteUserComponent {
  userId: string | null = '';
  user: User = new User();
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteUserComponent>,
    public db: Firestore,
    private router: Router,
    private authService: AuthService
  ) {}

  async deleteUser() {
    this.loading = true;
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    try {
      if (isAnonymous) {
        firebaseData = doc(this.db, 'guest_users', `${this.userId}`);
        await deleteDoc(firebaseData);
        this.dialogRef.close(); // Schließen Sie zuerst den Dialog
        this.router.navigate(['guest/user']); // Navigieren Sie dann zurück zur Benutzerseite
      } else {
        firebaseData = doc(this.db, 'users', `${this.userId}`);
        await deleteDoc(firebaseData);
        this.dialogRef.close(); // Schließen Sie zuerst den Dialog
        this.router.navigate(['/user']); // Navigieren Sie dann zurück zur Benutzerseite
      }
    } catch (error) {
      // Fehlerbehandlung, z.B. Benachrichtigung des Benutzers
      console.error('Fehler beim Löschen des Benutzers: ', error);
    }
    this.loading = false;
  }
}
