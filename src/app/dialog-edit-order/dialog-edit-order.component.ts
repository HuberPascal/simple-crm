import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../models/order.class';
import { doc, updateDoc } from 'firebase/firestore';
import { AuthService } from '../services/firebase-auth.service';

interface OrderStatus {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-edit-order',
  templateUrl: './dialog-edit-order.component.html',
  styleUrl: './dialog-edit-order.component.scss',
})
export class DialogEditOrderComponent implements OnInit {
  order: Order = new Order();
  userId: string | null = '';
  orderId: string | null = '';
  loading: boolean = false;
  selectedValue: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogEditOrderComponent>,
    public db: Firestore,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.selectedValue = this.order.orderStatus;
  }

  async saveOrder() {
    this.loading = true;
    const orderData = this.order;
    const orderId = this.order['orderId'];

    // Holen Sie sich den ausgewählten Order Status
    const selectedOrderStatus = this.selectedValue;

    this.order.orderStatus = selectedOrderStatus;

    let docRef: any;

    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

    if (isAnonymous) {
      docRef = doc(this.db, 'guest_orders', `${orderId}`);
      console.log('Das Dokument hat die ID', orderId);
    } else {
      docRef = doc(this.db, 'orders', `${orderId}`);
      console.log('Das Dokument hat die ID', orderId);
    }

    // Firestore Dokument aktualisieren
    try {
      await updateDoc(docRef, {
        amount: orderData.amount,
        // price: orderData.price,
        product: orderData.product,
        orderStatus: orderData.orderStatus,
      });

      console.log('Dokument erfolgreich aktualisiert');
      this.dialogRef.close();
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Dokuments:', error);
    }
    this.loading = false;
  }

  orderStatus: OrderStatus[] = [
    { value: 'Processing', viewValue: 'Processing' },
    { value: 'Shipped', viewValue: 'Shipped' },
    { value: 'Delivered', viewValue: 'Delivered' },
    { value: 'Canceled', viewValue: 'Canceled' },
  ];

  isSaveButtonDisabled(): boolean {
    return (
      // !this.order.price ||
      !this.order.product || !this.order.amount || !this.selectedValue
    );
  }
}
