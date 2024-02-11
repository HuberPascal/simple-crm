import { Component, OnInit } from '@angular/core';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { AuthService } from '../services/firebase-auth.service';
import { Firestore } from '@angular/fire/firestore';
import { Order } from '../../models/order.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddProductComponent } from '../dialog-add-product/dialog-add-product.component';
import { DialogEditProductComponent } from '../dialog-edit-product/dialog-edit-product.component';
import { Product } from '../../models/product.class';
import { DialogDeleteProductComponent } from '../dialog-delete-product/dialog-delete-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  allProducts: any[] = [];
  order: Order = new Order();
  product: Product = new Product();
  // productId: any;

  constructor(
    private authService: AuthService,
    public db: Firestore,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    // this.getOrderData();
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

    if (isAnonymous) {
      // Der Benutzer ist anonym (Gast)
      await this.getOrderData('guest_products'); // Methode, um Musterdaten für Gastbenutzer abzurufen
    } else {
      // Der Benutzer ist nicht anonym (registriert)
      await this.getOrderData('products');
    }
  }

  async getOrderData(product: string) {
    try {
      const productCollectionRef = collection(this.db, product);
      onSnapshot(productCollectionRef, (snapshot) => {
        this.allProducts = [];
        snapshot.docs.forEach((doc) => {
          const productData = doc.data();
          const productId = doc.id;
          productData['productId'] = productId;
          this.allProducts.push(productData);
        });
      });
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Produkte-Daten:', error);
    }
  }

  openDialog() {
    this.dialog.open(DialogAddProductComponent);
  }

  async editProduct(product: string) {
    const dialog = this.dialog.open(DialogEditProductComponent);
    // dialog.componentInstance.productId = this.productId;

    dialog.componentInstance.product = new Product(product);
  }

  async deleteProduct(product: string) {
    const dialog = this.dialog.open(DialogDeleteProductComponent);
    dialog.componentInstance.product = new Product(product);
  }
}
