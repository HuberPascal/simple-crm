import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

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

  ngOnInit(): void {
    console.log('allNotes ist', this.allNotesfromKanban);
    console.log('pendingTasks ist', this.pendingTasks);
    this.pushNotesInArray();
  }

  pushNotesInArray() {
    console.log('noteStatus ist', this.allNotesfromKanban.noteStatus);
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
          break;
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  triggerEditNoteEvent(kanban: any) {
    this.editNote.emit(kanban);
  }
}
