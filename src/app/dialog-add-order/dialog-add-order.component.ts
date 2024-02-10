import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../models/order.class';
import { addDoc, collection } from 'firebase/firestore';
import { UserService } from '../user.service';
import { AuthService } from '../services/firebase-auth.service';

interface OrderStatus {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-add-order',
  templateUrl: './dialog-add-order.component.html',
  styleUrl: './dialog-add-order.component.scss',
})
export class DialogAddOrderComponent {
  order = new Order();
  userId: string | null = '';
  loading: boolean = false;
  selectedValue: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogAddOrderComponent>,
    public db: Firestore,
    private authService: AuthService
  ) {}

  async saveOrder() {
    this.loading = true;

    try {
      const userId = this.userId;
      const userData = this.order.toJSON(); // Holen Sie sich das JSON-Objekt von der User-Klasse
      console.log('userData ist', userData);

      // Holen Sie sich den ausgewählten Order Status
      const selectedOrderStatus = this.selectedValue;

      // Fügen Sie die userId zum userData hinzu
      userData.userId = userId;
      userData.orderStatus = selectedOrderStatus;

      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        const docRef = await addDoc(
          collection(this.db, 'guest_orders'),
          userData
        );
        console.log(
          `Added JSON document with ID Guest Collection: ${docRef.id}`
        );
      } else {
        const docRef = await addDoc(collection(this.db, 'orders'), userData);
        console.log(`Added JSON document with ID: ${docRef.id}`);
      }

      // if (this.userService.isGuestUser) {

      // } else {

      // }
    } catch (error) {
      console.error('Fehler beim Schreiben der Dokumente (JSON):', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }

  orderStatus: OrderStatus[] = [
    { value: 'Processing', viewValue: 'Processing' },
    { value: 'Shipped', viewValue: 'Shipped' },
    { value: 'Delivered', viewValue: 'Delivered' },
    // { value: 'Canceled', viewValue: 'Canceled' },
  ];

  isSaveButtonDisabled(): boolean {
    return (
      !this.order.orderDate ||
      !this.order.price ||
      !this.order.product ||
      !this.order.amount ||
      !this.selectedValue
    );
  }
}
