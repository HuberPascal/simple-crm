import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user.class';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-dialog-delete-user',
  templateUrl: './dialog-delete-user.component.html',
  styleUrl: './dialog-delete-user.component.scss',
})
export class DialogDeleteUserComponent implements OnInit {
  userId: string | null = '';
  user: User = new User();
  loading: boolean = false;
  allOrders: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteUserComponent>,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {}

  /**
   * Delete User Data in Firebase and close the dialog box.
   */
  async deleteUser() {
    this.loading = true;

    try {
      this.database.deleteUser(this.userId);
      this.deleteAllOrders();
    } catch (error) {
      console.error('Fehler beim löschen des Users:', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }

  deleteAllOrders() {
    this.allOrders.forEach((order) => {
      let orderId = order['orderId'];
      console.log('allOrder ID ist', orderId);
      this.database.deleteOrder(orderId);
    });
  }
}
