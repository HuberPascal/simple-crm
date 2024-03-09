import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-dialog-swap-task',
  templateUrl: './dialog-swap-task.component.html',
  styleUrl: './dialog-swap-task.component.scss',
})
export class DialogSwapTaskComponent implements OnInit {
  kanban: any;
  taskStatus: string = '';
  taskStatusIsPending: boolean = false;
  taskStatusIsInProgress: boolean = false;
  taskStatusIsDone: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogSwapTaskComponent>,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {
    this.taskStatus = this.kanban.noteStatus;

    this.checkCurrentNoteStatus();
  }

  checkCurrentNoteStatus() {
    if (this.taskStatus == 'Pending') {
      this.taskStatusIsPending = true;
    } else if (this.taskStatus == 'InProgress') {
      this.taskStatusIsInProgress = true;
    } else if (this.taskStatus == 'Done') {
      this.taskStatusIsDone = true;
    }
  }

  swapTask(newStatus: string) {
    const taskId = this.kanban.taskId;
    const taskData = this.kanban;
    taskData.noteStatus = newStatus;

    this.database.updateTask(taskData, taskId);
    this.dialogRef.close();
  }
}
