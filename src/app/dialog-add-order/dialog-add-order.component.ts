import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../models/order.class';
import { Product } from '../../models/product.class';
import { addDoc, collection, getDoc, onSnapshot } from 'firebase/firestore';
import { UserService } from '../user.service';
import { AuthService } from '../services/firebase-auth.service';
import { user } from '@angular/fire/auth';

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
    public db: Firestore,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productName = this.allProducts.map((product) => ({
      value: product.productName,
      viewValue: `${product.productName} - ${product.price} CHF`, // Füge den Produktnamen und den Preis hinzu
      price: product.price,
    }));
  }

  async saveOrder() {
    this.loading = true;

    try {
      const userId = this.userId;
      const userData = this.order.toJSON(); // Holen Sie sich das JSON-Objekt von der User-Klasse

      // Holen Sie sich den ausgewählten Order Status
      const selectedOrderStatus = this.selectedValue;
      const selectedProduct = this.selectedProduct;

      if (selectedProduct) {
        userData.product = selectedProduct.name;
        userData.price = selectedProduct.price;
      }

      // Fügen Sie die userId zum userData hinzu
      userData.userId = userId;

      userData.orderStatus = selectedOrderStatus;
      // userData.product = selectedProduct;

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
  ];

  productName: ProductName[] = [];

  isSaveButtonDisabled(): boolean {
    return (
      !this.order.orderDate ||
      // !this.order.price ||
      // !this.order.product ||
      !this.order.amount ||
      !this.selectedValue ||
      !this.selectedProduct
    );
  }
}
