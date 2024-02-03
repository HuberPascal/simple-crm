import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { deleteDoc, doc } from 'firebase/firestore';
import { Order } from '../../models/order.class';

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
    public db: Firestore
  ) {}

  async deleteOrder() {
    const orderId = this.order['orderId'];

    try {
      await deleteDoc(doc(this.db, 'orders', `${orderId}`));
      this.dialogRef.close();
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzers: ', error);
    }
  }
}
