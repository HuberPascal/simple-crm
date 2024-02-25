import { Component, OnInit } from '@angular/core';
import { Kanban } from '../../models/kanban.class';
import { AuthService } from '../services/firebase-auth.service';
import { collection, onSnapshot } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent implements OnInit {
  kanban = new Kanban();
  isAnonymous: boolean = false;
  allNodes: any[] = [];

  constructor(private authService: AuthService, public db: Firestore) {}

  async ngOnInit(): Promise<void> {
    this.isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

    if (this.isAnonymous) {
      await this.getUserData('guest_kanban');
    } else {
      await this.getUserData('kanban');
    }
  }

  async getUserData(kanban: string) {
    try {
      const kanbanCollectionRef = collection(this.db, kanban);
      this.getKanbanDataOnSnapshot(kanbanCollectionRef);
    } catch (error) {}
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
}
