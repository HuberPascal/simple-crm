import { Component, OnInit } from '@angular/core';
import { Kanban } from '../../models/kanban.class';
import { AuthService } from '../services/firebase-auth.service';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
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
  allNodes: any[] = [];
  allUsers: any[] = [];

  constructor(
    private authService: AuthService,
    public db: Firestore,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    // console.log('user ist', this.user);

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
      this.allNodes = snapshot.docs.map((doc) => {
        const kanbanData = doc.data();
        console.log('kanbanData ist', kanbanData);
        return {
          node: kanbanData['node'],
          firstName: kanbanData['firstName'],
          lastName: kanbanData['lastName'],
          price: kanbanData['price'],
        };
      });
    });
  }

  openDialog() {
    const dialog = this.dialog.open(AddTaskDialogComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.allUsers = this.allUsers;
  }

  async getUserData() {
    const usersCollectionRef = collection(this.db, 'guest_users');
    onSnapshot(usersCollectionRef, (snapshot: { docs: any[] }) => {
      this.allUsers = snapshot.docs.map((doc) => {
        const userData = doc.data();
        return {
          firstName: userData['firstName'],
          lastName: userData['lastName'],
          price: userData['price'],
          node: userData['node'],
        };
      });
      console.log('allUser ist', this.allUsers);
    });
  }
}
