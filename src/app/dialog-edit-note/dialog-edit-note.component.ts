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

  loadDataInInputField() {
    console.log('currentNote ist', this.currentNote);
    console.log('selectedUser:', this.selectedUser);
    if (this.currentNote) {
      // Finden Sie den Benutzer in userName, der dem aktuellen Hinweis entspricht
      const selectedUserName = `${this.currentNote.firstName} ${this.currentNote.lastName}`;
      this.selectedUser = this.userName.find(
        (user) => user.viewValue === selectedUserName
      );

      if (!this.selectedUser) {
        // Wenn der Benutzer nicht in der Liste gefunden wird, fügen Sie ihn hinzu
        this.selectedUser = {
          firstName: this.currentNote.firstName,
          lastName: this.currentNote.lastName,
          viewValue:
            this.currentNote.firstName + ' ' + this.currentNote.lastName,
        };
        this.userName.push(this.selectedUser);
      }
    }
    this.selectedStatus = this.currentNote.noteStatus;
  }

  saveNote() {
    this.loading = true;
    try {
      const taskData = this.kanban;
      console.log('taskData ist', taskData);
      const taskId = taskData.taskId;
      // this.kanban.taskId = taskId;
      const firstName = this.selectedUser.firstName;
      const lastName = this.selectedUser.lastName;
      this.kanban.firstName = firstName;
      this.kanban.lastName = lastName;
      this.kanban.note = this.note;
      this.kanban.noteStatus = this.selectedStatus;
      console.log('taskData ist', taskData);
      this.database.updateTask(taskData, taskId);
    } catch (error) {
      console.error('Fehler beim Speichern der Task Daten', error);
    }
    this.dialogRef.close();
  }

  isSaveButtonDisabled() {
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
