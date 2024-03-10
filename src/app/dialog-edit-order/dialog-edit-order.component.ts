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
  productName: string;
  price: number;
  viewValue: string;
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
  allProducts: any[] = [];
  selectedProduct: any;
  currentProduct: any;

  constructor(
    public dialogRef: MatDialogRef<DialogEditOrderComponent>,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {
    console.log('allProducts', this.allProducts);

    this.selectedValue = this.order.orderStatus;
    this.loadDataInInputField();
  }

  /**
   * Loads data into the input fields.
   */
  loadDataInInputField() {
    this.populateProductName();
    this.selectCurrentProduct();
  }

  populateProductName() {
    this.productName = this.allProducts.map((product) => ({
      productName: product.productName,
      price: product.price,
      viewValue: `${product.productName} - ${product.price} CHF`,
    }));
    console.log('productName', this.productName);
  }

  selectCurrentProduct() {
    console.log('currentProduct', this.currentProduct);
    if (this.currentProduct) {
      const selectedProductName = `${this.currentProduct.product} - ${this.currentProduct.price} CHF`;

      this.selectedProduct = this.productName.find(
        (product) => product.viewValue === selectedProductName
      );

      if (!this.selectedProduct) {
        this.selectedProduct = {
          productName: this.currentProduct.productName,
          viewValue: selectedProductName,
        };
        this.productName.push(this.selectedProduct);
      }
    }
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
      this.order.product = this.selectedProduct.productName;
      this.order.price = this.selectedProduct.price;
      console.log('neue edit Order Daten', orderData);

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
   * Array representing product names.
   */
  productName: ProductName[] = [];

  /**
   * Only releases the save button when all fields have been filled out
   * @returns {boolean} Returns true if all is valid, otherwise false.
   */
  isSaveButtonDisabled(): boolean {
    return !this.order.product || !this.order.amount || !this.selectedValue;
  }
}
