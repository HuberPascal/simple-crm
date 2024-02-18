import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../models/order.class';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-dialog-delete-order',
  templateUrl: './dialog-delete-order.component.html',
  styleUrl: './dialog-delete-order.component.scss',
})
export class DialogDeleteOrderComponent {
  order: Order = new Order();
  orderId: string | null = '';
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteOrderComponent>,
    private database: DatabaseService
  ) {}

  /**
   * Delete Order Data in Firebase and close the dialog box.
   */
  async deleteOrder() {
    this.loading = true;
    const orderId = this.order['orderId'];

    try {
      this.database.deleteOrder(orderId);
    } catch (error) {
      console.error('Fehler beim löschen der Bestellung:', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }
}
