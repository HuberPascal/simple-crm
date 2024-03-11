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
  currentProductId: number;
}

@Component({
  selector: 'app-dialog-add-order',
  templateUrl: './dialog-add-order.component.html',
  styleUrl: './dialog-add-order.component.scss',
})
export class DialogAddOrderComponent implements OnInit {
  order = new Order();
  product = new Product();
  userId: string | null = '';
  loading: boolean = false;
  selectedValue: string | undefined;
  productSelectedValue: string | undefined;
  allProducts: any[] = [];
  item: any[] = [];
  selectedProduct: { name: string; price: number } | undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogAddOrderComponent>,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {
    this.loadProductNameInInputField();
  }

  /**
   * Adds the product name into the input field.
   */
  loadProductNameInInputField() {
    this.productName = this.allProducts.map((product) => ({
      value: product.productName,
      viewValue: `${product.productName} - ${product.price} CHF`, // Produktnamen und den Preis hinzufügen
      price: product.price,
      currentProductId: product.currentProductId,
    }));
  }

  /**
   * Save Data from the form in Firebase and close the dialog box.
   */
  async saveOrder() {
    this.loading = true;
    try {
      const userId = this.userId;
      const orderData = this.order.toJSON();
      const selectedValue = this.selectedValue; // Am Mat-Select Feld vorab einen Wert zuweisen
      const selectedProduct = this.selectedProduct; // Im Mat-Select Feld den ausgewählten Produktename speichern

      await this.database.saveOrder(
        userId,
        orderData,
        selectedValue,
        selectedProduct
      );
    } catch (error) {
      console.error('Fehler beim Speichern der Bestellung:', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }

  /**
   * Only releases the save button when all fields have been filled out
   * @returns {boolean} Returns true if the email address is valid, otherwise false.
   */
  isSaveButtonDisabled(): boolean {
    return (
      !this.order.orderDate ||
      this.order.amount <= 0 ||
      !this.selectedValue ||
      !this.selectedProduct
    );
  }

  /**
   * Provides the value for the Product Name input field
   */
  orderStatus: OrderStatus[] = [
    { value: 'Processing', viewValue: 'Processing' },
    { value: 'Shipped', viewValue: 'Shipped' },
    { value: 'Delivered', viewValue: 'Delivered' },
  ];

  /**
   * Provides the value for the Product Name input field. The field is filled by the loadProductNameFromInputField function
   */
  productName: ProductName[] = [];
}
