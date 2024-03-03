import { Component, OnInit } from '@angular/core';
import { Kanban } from '../../models/kanban.class';
import { AuthService } from '../services/firebase-auth.service';
import { collection, onSnapshot } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddTaskConmponent } from '../dialog-add-task/dialog-add-task.component';
import { DialogEditTaskComponent } from '../dialog-edit-task/dialog-edit-task.component';
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
  filterInputValue: any; // Eingabe vom Suchfeld
  originalNotes: any[] = [];

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

  /**
   * Retrieves Kanban data from Firestore.
   * @param kanban - The name of the Firestore collection containing Kanban data.
   */
  async getKanbanData(kanban: string) {
    try {
      const kanbanCollectionRef = collection(this.db, kanban);
      this.getKanbanDataOnSnapshot(kanbanCollectionRef);
    } catch (error) {
      console.log('Fehler beim laden der Kanban Daten von Firebase:', error);
    }
    this.getUserData();
  }

  /**
   * Listens for changes in Kanban data and updates the component accordingly.
   * @param kanbanCollectionRef - Reference to the Firestore collection containing Kanban data.
   */
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
      this.originalNotes = this.allNotes;
    });
  }

  /**
   * Opens the dialog for adding a new task.
   */
  openDialogAddTask() {
    const dialog = this.dialog.open(DialogAddTaskConmponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.allUsers = this.allUsers;
  }

  /**
   * Retrieves user data from Firestore.
   */
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

  /**
   * Renders the Kanban Drag and Drop component.
   */
  renderKanbanDragAndDropComponent() {
    this.showKanbanDragAndDropComponent = true;
  }

  /**
   * Opens the dialog for editing a task.
   * @param currentNote - The current task being edited.
   */
  onEditNote(currentNote: any) {
    const dialog = this.dialog.open(DialogEditTaskComponent);
    dialog.componentInstance.kanban = new Kanban(this.kanban.toJSON());
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.allUsers = this.allUsers;
    dialog.componentInstance.currentNote = currentNote;
  }

  /**
   * Filters tasks based on the input value from the search field.
   * If the filter input is empty, displays the original unfiltered data.
   */
  filterTasksFromInput() {
    // Wenn der Filter leer ist, die ursprünglichen Daten anzeigen
    if (this.filterInputValue === '') {
      this.allNotes = this.originalNotes;
    } else {
      // Das ursprüngliche Array filtern und das gefilterte Array speichern
      const filteredNotes = this.originalNotes.filter((task) =>
        this.searchTask(task)
      );
      this.allNotes = filteredNotes;
    }
  }

  /**
   * Searches for a task based on the filter input value.
   * @param task - The task to search within.
   */
  searchTask(task: any) {
    // Überprüfen, ob der Filterwert in firstName, lastName oder note enthalten ist
    const searchValue = this.filterInputValue.toLowerCase();
    return (
      task.firstName.toString().toLowerCase().includes(searchValue) ||
      task.lastName.toString().toLowerCase().includes(searchValue) ||
      task.note.toString().toLowerCase().includes(searchValue)
    );
  }
}
