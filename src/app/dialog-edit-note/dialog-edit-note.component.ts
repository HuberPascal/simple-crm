import { Component, OnInit } from '@angular/core';
import { Kanban } from '../../models/kanban.class';
import { User } from '../../models/user.class';
import { MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-dialog-edit-note',
  templateUrl: './dialog-edit-note.component.html',
  styleUrl: './dialog-edit-note.component.scss',
})
export class DialogEditNoteComponent implements OnInit {
  kanban: Kanban = new Kanban();
  user: User = new User();
  loading: boolean = false;
  selectedUser: any;
  selectedStatus: any;
  allUsers: any[] = [];
  note: string = '';
  currentNote: any;

  constructor(
    public dialogRef: MatDialogRef<DialogEditNoteComponent>,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {
    this.loadDataInInputField();
  }

  /**
   * Loads data into the input fields.
   */
  loadDataInInputField() {
    this.populateUserName();
    this.selectCurrentUser();
    this.populateCurrentTaskData();
  }

  /**
   * Populates the select fields with user names.
   */
  populateUserName() {
    // Populate the select fields with all users from allUsers
    this.userName = this.allUsers.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      viewValue: `${user.firstName} ${user.lastName}`,
    }));
  }

  /**
   * Selects the current user or adds it.
   */
  selectCurrentUser() {
    if (this.currentNote) {
      const selectedUserName = `${this.currentNote.firstName} ${this.currentNote.lastName}`;

      // Find the user in the userName list that matches the current note
      this.selectedUser = this.userName.find(
        (user) => user.viewValue === selectedUserName
      );

      // If the user is not found, add it to the userName list
      if (!this.selectedUser) {
        this.selectedUser = {
          firstName: this.currentNote.firstName,
          lastName: this.currentNote.lastName,
          viewValue: selectedUserName,
        };
        this.userName.push(this.selectedUser);
      }
    }
  }

  /**
   * Populates the current task data.
   */
  populateCurrentTaskData() {
    this.note = this.currentNote.note;
    this.selectedStatus = this.currentNote.noteStatus;
  }

  /**
   * Saves the note data.
   */
  saveNote() {
    this.loading = true;
    try {
      const taskData = this.kanban;
      const taskId = this.currentNote.taskId;

      this.kanban.firstName = this.selectedUser.firstName;
      this.kanban.lastName = this.selectedUser.lastName;
      this.kanban.note = this.note;
      this.kanban.noteStatus = this.selectedStatus;

      this.database.updateTask(taskData, taskId);
    } catch (error) {
      console.error('Fehler beim Speichern der Task Daten', error);
    }
    this.dialogRef.close();
  }

  /**
   * Checks if the save button should be disabled based on the length of the note.
   * @returns {boolean} True if the save button should be disabled (note length > 0), otherwise false.
   */
  isSaveButtonDisabled(): boolean {
    return this.note.length > 0;
  }

  userName: UserName[] = [];

  /**
   * Provides the value for the productType input field
   */
  noteStatus: NoteStatus[] = [
    { value: 'Pending', viewValue: 'Pending' },
    { value: 'InProgress', viewValue: 'InProgress' },
    { value: 'Done', viewValue: 'Done' },
  ];
}
