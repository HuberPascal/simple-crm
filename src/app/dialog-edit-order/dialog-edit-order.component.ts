import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../models/order.class';
import { Product } from '../../models/product.class';
import { DatabaseService } from '../services/database.service';

interface OrderStatus {
  value: string;
  viewValue: string;
}

interface ProductName {
  value: string;
  viewValue: string;
  price: number;
}

@Component({
  selector: 'app-dialog-edit-order',
  templateUrl: './dialog-edit-order.component.html',
  styleUrl: './dialog-edit-order.component.scss',
})
export class DialogEditOrderComponent implements OnInit {
  order: Order = new Order();
  product = new Product();
  orderId: string | null = '';
  loading: boolean = false;
  selectedValue: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogEditOrderComponent>,
    private database: DatabaseService
  ) {}

  ngOnInit() {
    this.selectedValue = this.order.orderStatus;
  }

  /**
   * Updates the order data in the database and close the dialog box.
   */
  async saveOrder() {
    this.loading = true;
    try {
      const orderData = this.order;
      const orderId = this.order['orderId'];
      this.order.orderStatus = this.selectedValue;

      this.database.updateOrder(orderData, orderId);
    } catch (error) {
      console.error('Fehler beim updaten der Bestellung:', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }

  /**
   * Provides the value for the OrderStatus input field
   */
  orderStatus: OrderStatus[] = [
    { value: 'Processing', viewValue: 'Processing' },
    { value: 'Shipped', viewValue: 'Shipped' },
    { value: 'Delivered', viewValue: 'Delivered' },
    { value: 'Canceled', viewValue: 'Canceled' },
  ];

  /**
   * Only releases the save button when all fields have been filled out
   * @returns {boolean} Returns true if all is valid, otherwise false.
   */
  isSaveButtonDisabled(): boolean {
    return !this.order.product || !this.order.amount || !this.selectedValue;
  }
}
