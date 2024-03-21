import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user.class';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrl: './dialog-edit-user.component.scss',
})
export class DialogEditUserComponent implements OnInit {
  user: User = new User();
  loading: boolean = false;
  userId: string | null = '';
  userData: any;

  constructor(
    public dialogRef: MatDialogRef<DialogEditUserComponent>,
    private database: DatabaseService
  ) {}

  ngOnInit() {
    this.user.birthDate = new Date(this.userData.birthDate);
  }

  /**
   * Updates the user data in the database.
   */
  async saveUser() {
    this.loading = true;
    try {
      const userData = this.user.toJSON();
      await this.database.updateUser(userData, this.userId);
    } catch (error) {
      console.error('Fehler beim updaten des Users:', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }

  /**
   * Only releases the save button when all fields have been filled out
   * @returns {boolean} Returns true if all is valid, otherwise false.
   */
  isSaveButtonDisabled(): boolean {
    return (
      this.user.firstName.length === 0 ||
      this.user.lastName.length === 0 ||
      !this.user.birthDate ||
      this.user.email.length === 0
    );
  }
}
