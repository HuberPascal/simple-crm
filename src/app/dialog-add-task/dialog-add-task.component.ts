import { Component, OnInit } from '@angular/core';
import { Kanban } from '../../models/kanban.class';
import { MatDialogRef } from '@angular/material/dialog';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { DatabaseService } from '../services/database.service';

interface UserName {
  firstName: string;
  lastName: string;
  viewValue: string;
}

interface NoteStatus {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-add-task',
  templateUrl: './dialog-add-task.component.html',
  styleUrl: './dialog-add-task.component.scss',
})
export class DialogAddTaskConmponent implements OnInit {
  loading: boolean = false;
  kanban = new Kanban();
  user: User = new User();
  selectedUser: any;
  selectedStatus: any;
  kanbanData: any[] = [];
  allUsers: any[] = [];
  selectedValue: any;
  note: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogAddTaskConmponent>,
    public db: Firestore,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {
    this.loadUserNameInInputField();
  }

  /**
   * Loads user names into the input field.
   */
  loadUserNameInInputField() {
    this.userName = this.allUsers.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      viewValue: `${user.firstName} ${user.lastName}`,
    }));
    console.log('userName ist', this.userName);
  }

  /**
   * Saves the note to the database.
   */
  async saveNote() {
    try {
      const note = this.note;
      const kanbanData = this.kanban.toJSON();
      const selectedStatus = this.selectedStatus;
      const selectedUserFirstName = this.selectedUser.firstName;
      const selectedUserLastName = this.selectedUser.lastName;

      await this.database.saveNote(
        note,
        kanbanData,
        selectedStatus,
        selectedUserFirstName,
        selectedUserLastName
      );
    } catch (error) {
      console.error('Fehler beim speichern der Notiz', error);
    }
    this.dialogRef.close();
  }

  /**
   * Checks if the selected user is falsy or if the length of the note is greater than 10 characters
   * or if the selected status is falsy.
   * @returns {boolean} True if any of the conditions are met, otherwise false.
   */
  isSaveButtonDisabled(): boolean {
    return !this.selectedUser || this.note.length == 0 || !this.selectedStatus;
  }

  /**
   * Array representing different note statuses.
   */
  noteStatus: NoteStatus[] = [
    { value: 'Pending', viewValue: 'Pending' },
    { value: 'InProgress', viewValue: 'In Progress' },
    { value: 'Done', viewValue: 'Done' },
  ];

  /**
   * Array representing user names.
   */
  userName: UserName[] = [];
}
