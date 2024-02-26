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
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss',
})
export class AddTaskDialogComponent implements OnInit {
  loading: boolean = false;
  kanban = new Kanban();
  user: User = new User();
  selectedUser: any;
  selectedStatus: any;
  kanbanData: any[] = [];
  allUsers: any[] = [];
  selectedValue: any;
  nodeStatus: any;
  note: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    private authService: AuthService,
    public db: Firestore,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {
    console.log('die übergebenen User daten sind', this.allUsers);
    this.loadUserNameInInputField();
    console.log('der  Status ist', this.nodeStatus);
  }

  loadUserNameInInputField() {
    this.userName = this.allUsers.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      viewValue: `${user.firstName} ${user.lastName}`,
    }));
  }

  async saveNode() {
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
  }

  isSaveButtonDisabled() {}

  noteStatus: NoteStatus[] = [
    { value: 'Pending', viewValue: 'Pending' },
    { value: 'InProgress', viewValue: 'InProgress' },
    { value: 'Done', viewValue: 'Done' },
  ];

  userName: UserName[] = [];
}
