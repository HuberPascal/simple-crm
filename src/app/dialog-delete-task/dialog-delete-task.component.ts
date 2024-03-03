import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-dialog-delete-task',
  templateUrl: './dialog-delete-task.component.html',
  styleUrl: './dialog-delete-task.component.scss',
})
export class DialogDeleteTaskComponent {
  kanban: any;

  constructor(private database: DatabaseService) {}

  /**
   * Deletes a task from the database.
   */
  deleteTask() {
    const taskId = this.kanban.taskId;
    this.database.deleteTask(taskId);
  }
}
