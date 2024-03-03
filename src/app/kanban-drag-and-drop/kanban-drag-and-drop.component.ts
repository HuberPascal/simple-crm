import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Kanban } from '../../models/kanban.class';
import { DatabaseService } from '../services/database.service';
import { DialogDeleteTaskComponent } from '../dialog-delete-task/dialog-delete-task.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-kanban-drag-and-drop',
  templateUrl: './kanban-drag-and-drop.component.html',
  styleUrl: './kanban-drag-and-drop.component.scss',
})
export class KanbanDragAndDropComponent implements OnInit {
  @Input() allNotesfromKanban: any;
  @Output() editNote: EventEmitter<any> = new EventEmitter();
  pendingTasks: any[] = [];
  inProgressTasks: any[] = [];
  doneTasks: any[] = [];
  kanban = new Kanban();
  currentTask: any;
  taskId: string = '';

  constructor(private database: DatabaseService, public dialog: MatDialog) {}

  ngOnInit(): void {
    console.log('allNotes ist', this.allNotesfromKanban);
    console.log('pendingTasks ist', this.pendingTasks);
    this.pushNotesInArray();
  }

  /**
   * Lifecycle hook that is called when any data-bound property of the directive changes.
   * @param {SimpleChanges} changes - An object containing the changed properties and their previous and current values.
   * @returns {void}
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allNotesfromKanban']) {
      this.pushNotesInArray();
    }
  }

  /**
   * Pushes notes into corresponding arrays based on their status.
   */
  pushNotesInArray() {
    this.pendingTasks = [];
    this.inProgressTasks = [];
    this.doneTasks = [];

    this.allNotesfromKanban.forEach((note: { noteStatus: any }) => {
      switch (note.noteStatus) {
        case 'Pending':
          this.pendingTasks.push(note);
          break;
        case 'InProgress':
          this.inProgressTasks.push(note);
          break;
        case 'Done':
          this.doneTasks.push(note);
          break;
        default:
          this.pendingTasks.push(note);
          break;
      }
    });
  }

  /**
   * Handles the drop event when an item is dropped into a container.
   * @param {CdkDragDrop<string[]>} event - The drop event object.
   */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      this.moveItemWithinContainer(event);
    } else {
      this.moveItemToDifferentContainer(event);
    }
  }

  /**
   * Moves an item within the same container.
   * @param {CdkDragDrop<string[]>} event - The drop event object.
   */
  private moveItemWithinContainer(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  /**
   * Moves an item to a different container.
   * @param {CdkDragDrop<string[]>} event - The drop event object.
   */
  private moveItemToDifferentContainer(event: CdkDragDrop<string[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.updateTaskStatus(event);
  }

  /**
   * Updates the status of the task after it has been moved to a different container.
   * @param {CdkDragDrop<string[]>} event - The drop event object.
   */
  private updateTaskStatus(event: CdkDragDrop<string[]>) {
    this.currentTask = event.item.data;
    this.taskId = this.currentTask.taskId;

    if (event.container.data === this.pendingTasks) {
      console.log('Task moved to Pending array');
      this.currentTask.noteStatus = 'Pending';
    } else if (event.container.data === this.inProgressTasks) {
      console.log('Task moved to In Progress array');
      this.currentTask.noteStatus = 'InProgress';
    } else if (event.container.data === this.doneTasks) {
      console.log('Task moved to Done array');
      this.currentTask.noteStatus = 'Done';
    }

    this.database.updateTask(this.currentTask, this.taskId);
  }

  /**
   * Triggers the edit task event.
   * @param {any} kanban - The kanban task to be edited.
   */
  triggerEditTaskEvent(kanban: any) {
    this.editNote.emit(kanban);
  }

  /**
   * Opens a dialog for deleting a task.
   * @param {any} kanban - The kanban task to be deleted.
   */
  openDialogDeleteTask(kanban: any) {
    const dialog = this.dialog.open(DialogDeleteTaskComponent);
    dialog.componentInstance.kanban = kanban;
  }
}
