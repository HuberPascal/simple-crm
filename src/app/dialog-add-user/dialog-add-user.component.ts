import { Component } from '@angular/core';
import { User } from '../../models/user.class';
import { MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';

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
    private database: DatabaseService
  ) {}

  /**
   * Save Data from the form in Firebase and close the dialog box.
   */
  async saveUser() {
    this.loading = true;
    try {
      const userData = this.user.toJSON();
      // this.user.birthDate = this.birthDate.getTime();
      await this.database.saveUser(userData);
    } catch (error) {
      console.error('Fehler beim Schreiben der Dokumente (JSON):', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }

  /**
   * Only releases the save button when all fields have been filled out
   * @returns {boolean}
   */
  isSaveButtonDisabled(): boolean {
    return (
      !this.user.firstName ||
      !this.user.lastName ||
      !this.user.email ||
      !this.user.birthDate ||
      !this.user.street ||
      !this.user.zipCode ||
      !this.user.city ||
      !this.validateMail()
    );
  }

  /**
   * Validates the user's email address.
   * @returns {boolean} Returns true if the email address is valid, otherwise false.
   */
  validateMail(): boolean {
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
