import { Component } from '@angular/core';
import { User } from '../../models/user.class';
import { MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';

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
    private database: DatabaseService
  ) {}

  /**
   * Updates the user data in the database and close the dialog box.
   */
  async saveUser() {
    this.loading = true;
    try {
      const userData = this.user.toJSON();
      await this.database.updateUser(userData, this.userId);
    } catch (error) {
      console.error('Fehler beim updaten der Adresse:', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }
}
