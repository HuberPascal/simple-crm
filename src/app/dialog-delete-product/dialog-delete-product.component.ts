import { Component } from '@angular/core';
import { Product } from '../../models/product.class';
import { MatDialogRef } from '@angular/material/dialog';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../services/firebase-auth.service';
import { deleteDoc, doc } from 'firebase/firestore';

@Component({
  selector: 'app-dialog-delete-product',
  templateUrl: './dialog-delete-product.component.html',
  styleUrl: './dialog-delete-product.component.scss',
})
export class DialogDeleteProductComponent {
  product: Product = new Product();
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteProductComponent>,
    public db: Firestore,
    private authService: AuthService
  ) {}

  async deleteOrder() {
    this.loading = true;
    const productId = this.product['productId'];
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    try {
      if (isAnonymous) {
        firebaseData = doc(this.db, 'guest_products', `${productId}`);
        await deleteDoc(firebaseData);
        this.dialogRef.close();
      } else {
        firebaseData = doc(this.db, 'products', `${productId}`);
        await deleteDoc(firebaseData);
        this.dialogRef.close();
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Produkts: ', error);
    }
    this.loading = false;
  }
}
