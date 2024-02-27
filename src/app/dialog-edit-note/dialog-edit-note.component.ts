import { Component, OnInit } from '@angular/core';
import { Kanban } from '../../models/kanban.class';
import { User } from '../../models/user.class';
import { MatDialogRef } from '@angular/material/dialog';

interface UserName {
  firstName: string;
  lastName: string;
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
  noteStatus: any;
  allUsers: any[] = [];
  note: string = '';
  currentNote: any;

  constructor(public dialogRef: MatDialogRef<DialogEditNoteComponent>) {}

  ngOnInit(): void {
    this.loadUserNameInInputField();
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
          lastName: this.currentNote.firstlasName,
          viewValue:
            this.currentNote.firstName + ' ' + this.currentNote.lastName,
        };
        this.userName.push(this.selectedUser);
      }
    }
  }

  loadUserNameInInputField() {
    this.userName = this.allUsers.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      viewValue: `${user.firstName} ${user.lastName}`,
    }));
  }

  saveNote() {}

  isSaveButtonDisabled() {}

  userName: UserName[] = [];
}
