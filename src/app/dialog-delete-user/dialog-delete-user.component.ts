import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user.class';
import { DatabaseService } from '../services/database.service';

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
    private database: DatabaseService
  ) {}

  /**
   * Delete User Data in Firebase and close the dialog box.
   */
  async deleteUser() {
    this.loading = true;

    try {
      this.database.deleteUser(this.userId);
    } catch (error) {
      console.error('Fehler beim löschen des Users:', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }
}
