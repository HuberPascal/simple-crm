import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { deleteDoc, doc } from 'firebase/firestore';
import { Order } from '../../models/order.class';
import { AuthService } from '../services/firebase-auth.service';

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
    public db: Firestore,
    private authService: AuthService
  ) {}

  async deleteOrder() {
    this.loading = true;
    const orderId = this.order['orderId'];
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    try {
      if (isAnonymous) {
        firebaseData = doc(this.db, 'guest_orders', `${orderId}`);
        await deleteDoc(firebaseData);
        this.dialogRef.close();
      } else {
        firebaseData = doc(this.db, 'orders', `${orderId}`);
        await deleteDoc(firebaseData);
        this.dialogRef.close();
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzers: ', error);
    }
    this.loading = false;
  }
}
