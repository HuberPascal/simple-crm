import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.class';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/firebase-auth.service';
import { Firestore } from '@angular/fire/firestore';
import { doc, updateDoc } from 'firebase/firestore';

interface ProductType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-edit-product',
  templateUrl: './dialog-edit-product.component.html',
  styleUrl: './dialog-edit-product.component.scss',
})
export class DialogEditProductComponent implements OnInit {
  product: Product = new Product();
  loading: boolean = false;
  selectedValue: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogEditProductComponent>,
    public db: Firestore,
    private authService: AuthService
  ) {}

  // productId: any;

  ngOnInit() {
    this.selectedValue = this.product.orderType;
  }

  async saveProduct() {
    this.loading = true;
    const productData = this.product;
    const productId = this.product['productId'];

    // Holen Sie sich den ausgewählten Order Status
    const selectedProductType = this.selectedValue;

    this.product.orderType = selectedProductType;

    let docRef: any;

    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

    if (isAnonymous) {
      docRef = doc(this.db, 'guest_products', `${productId}`);
      console.log('Das Dokument hat die ID', productId);
    } else {
      docRef = doc(this.db, 'products', `${productId}`);
      console.log('Das Dokument hat die ID', productId);
    }

    // Firestore Dokument aktualisieren
    try {
      await updateDoc(docRef, {
        productName: productData.productName,
        price: productData.price,
        orderType: productData.orderType,
      });

      console.log('Dokument erfolgreich aktualisiert');
      this.dialogRef.close();
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Dokuments:', error);
    }
    this.loading = false;
  }

  isSaveButtonDisabled() {}

  productType: ProductType[] = [
    { value: 'Product', viewValue: 'Product' },
    { value: 'Service', viewValue: 'Service' },
  ];
}
