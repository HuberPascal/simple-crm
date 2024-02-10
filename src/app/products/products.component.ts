import { Component, OnInit } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { AuthService } from '../services/firebase-auth.service';
import { Firestore } from '@angular/fire/firestore';
import { Order } from '../../models/order.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddProductComponent } from '../dialog-add-product/dialog-add-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  allOrders: any[] = [];
  order: Order = new Order();

  constructor(
    private authService: AuthService,
    public db: Firestore,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getOrderData();
  }

  async getOrderFirebaseData() {
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    if (isAnonymous) {
      return (firebaseData = collection(this.db, 'guest_products'));
    } else {
      return (firebaseData = collection(this.db, 'products'));
    }
  }

  async getOrderData() {
    const firebaseData = await this.getOrderFirebaseData();
    this.allOrders = [];

    try {
      const querySnapshot = await getDocs(firebaseData);
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        this.allOrders.push(new Order(orderData));
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Produkte:', error);
    }
  }

  openDialog() {
    const dialog = this.dialog.open(DialogAddProductComponent);
  }
}
