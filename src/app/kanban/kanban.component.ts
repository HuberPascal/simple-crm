import { Component, OnInit } from '@angular/core';
import { Kanban } from '../../models/kanban.class';
import { AuthService } from '../services/firebase-auth.service';
import { collection, onSnapshot } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddTaskConmponent } from '../dialog-add-task/dialog-add-task.component';
import { DialogEditNoteComponent } from '../dialog-edit-note/dialog-edit-note.component';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent implements OnInit {
  kanban = new Kanban();
  user = new User();
  isAnonymous: boolean = false;
  allNotes: any[] = [];
  allUsers: any[] = [];
  currentNote: any;
  taskId: string = '';
  showKanbanDragAndDropComponent: boolean = false;

  constructor(
    private authService: AuthService,
    public db: Firestore,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

    if (this.isAnonymous) {
      await this.getKanbanData('guest_kanban');
    } else {
      await this.getKanbanData('kanban');
    }

    this.getUserData();
  }

  async getKanbanData(kanban: string) {
    try {
      const kanbanCollectionRef = collection(this.db, kanban);
      this.getKanbanDataOnSnapshot(kanbanCollectionRef);
    } catch (error) {}

    this.getUserData();
  }

  getKanbanDataOnSnapshot(kanbanCollectionRef: any) {
    onSnapshot(kanbanCollectionRef, (snapshot: { docs: any[] }) => {
      this.allNotes = snapshot.docs.map((doc) => {
        const kanbanData = doc.data();

        return {
          taskId: doc.id,
          note: kanbanData['note'],
          firstName: kanbanData['firstName'],
          lastName: kanbanData['lastName'],
          noteStatus: kanbanData['noteStatus'],
          price: kanbanData['price'],
        };
      });
      console.log('kanbanData ist', this.allNotes);
    });
  }

  openDialog() {
    const dialog = this.dialog.open(DialogAddTaskConmponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.allUsers = this.allUsers;
  }

  async getUserData() {
    const usersCollectionRef = collection(this.db, 'guest_users');
    onSnapshot(usersCollectionRef, (snapshot: { docs: any[] }) => {
      this.allUsers = snapshot.docs.map((doc) => {
        const userData = doc.data();
        this.kanban.taskId = doc.id;
        return {
          id: doc.id,
          firstName: userData['firstName'],
          lastName: userData['lastName'],
          price: userData['price'],
          note: userData['note'],
        };
      });
      console.log('allUser ist', this.allUsers);
      this.renderKanbanDragAndDropComponent();
    });
  }

  renderKanbanDragAndDropComponent() {
    this.showKanbanDragAndDropComponent = true;
  }

  onEditNote(currentNote: any) {
    const dialog = this.dialog.open(DialogEditNoteComponent);
    dialog.componentInstance.kanban = new Kanban(this.kanban.toJSON());
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.allUsers = this.allUsers;
    dialog.componentInstance.currentNote = currentNote;
  }
}
