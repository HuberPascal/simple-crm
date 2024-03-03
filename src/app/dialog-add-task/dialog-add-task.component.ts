import { Component, OnInit } from '@angular/core';
import { Kanban } from '../../models/kanban.class';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/firebase-auth.service';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, getDocs } from 'firebase/firestore';
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
    private authService: AuthService,
    public db: Firestore,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {
    console.log('die übergebenen User daten sind', this.allUsers);
    this.loadUserNameInInputField();
    console.log('der  Status ist', this.noteStatus);
  }

  loadUserNameInInputField() {
    this.userName = this.allUsers.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      viewValue: `${user.firstName} ${user.lastName}`,
    }));
  }

  async saveNote() {
    try {
      console.log('note ist', this.note);
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

  isSaveButtonDisabled() {} //////////////////////

  noteStatus: NoteStatus[] = [
    { value: 'Pending', viewValue: 'Pending' },
    { value: 'InProgress', viewValue: 'In Progress' },
    { value: 'Done', viewValue: 'Done' },
  ];

  userName: UserName[] = [];
}
