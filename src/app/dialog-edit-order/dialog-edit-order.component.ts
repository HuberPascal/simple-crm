import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { Order } from '../../models/order.class';
import { User } from '../../models/user.class';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

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
    public db: Firestore
  ) {}

  ngOnInit() {
    this.selectedValue = this.order.orderStatus;
  }

  async saveOrder() {
    const orderData = this.order;
    const orderId = this.order['orderId'];

    // Holen Sie sich den ausgewählten Order Status
    const selectedOrderStatus = this.selectedValue;

    this.order.orderStatus = selectedOrderStatus;

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

  orderStatus: OrderStatus[] = [
    { value: 'Processing', viewValue: 'Processing' },
    { value: 'Shipped', viewValue: 'Shipped' },
    { value: 'Delivered', viewValue: 'Delivered' },
    { value: 'Canceled', viewValue: 'Canceled' },
  ];

  isSaveButtonDisabled(): boolean {
    return (
      !this.order.price ||
      !this.order.product ||
      !this.order.amount ||
      !this.selectedValue
    );
  }
}
