import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { Order } from '../../models/order.class';
import { User } from '../../models/user.class';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-dialog-edit-order',
  templateUrl: './dialog-edit-order.component.html',
  styleUrl: './dialog-edit-order.component.scss',
})
export class DialogEditOrderComponent {
  order: Order = new Order();
  userId: string | null = '';
  orderId: string | null = '';
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditOrderComponent>,
    public db: Firestore
  ) {}

  async saveOrder() {
    const orderData = this.order;
    const orderId = this.order['orderId'];

    const docRef = doc(this.db, 'orders', `${orderId}`);
    // const docRef = doc(this.db, 'orders', 'FyHulF0Gx2KT0YLzHNi9');
    console.log('Das Dokument hat die ID', orderId);

    // Firestore Dokument aktualisieren
    try {
      await updateDoc(docRef, {
        amount: orderData.amount,
        price: orderData.price,
        product: orderData.product,
        orderStatus: orderData.orderStatus,
      });

      console.log('Dokument erfolgreich aktualisiert');
      this.dialogRef.close();
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Dokuments:', error);
    }
  }
}
