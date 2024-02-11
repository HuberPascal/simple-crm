import { Component } from '@angular/core';
import { Product } from '../../models/product.class';
import { MatDialogRef } from '@angular/material/dialog';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../services/firebase-auth.service';
import { addDoc, collection } from 'firebase/firestore';

interface OrderType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-add-product',
  templateUrl: './dialog-add-product.component.html',
  styleUrl: './dialog-add-product.component.scss',
})
export class DialogAddProductComponent {
  loading: boolean = false;
  product = new Product();
  selectedValue: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogAddProductComponent>,
    public db: Firestore,
    private authService: AuthService
  ) {}

  async saveOrder() {
    this.loading = true;

    try {
      const userData = this.product.toJSON(); // Holen Sie sich das JSON-Objekt von der User-Klasse
      console.log('userData ist', userData);

      // Holen Sie sich den ausgewählten Order Status
      const selectedTypeStatus = this.selectedValue;

      // Fügen Sie die userId zum userData hinzu
      userData.orderType = selectedTypeStatus;

      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        const docRef = await addDoc(
          collection(this.db, 'guest_products'),
          userData
        );
        console.log(
          `Added JSON document with ID Guest Collection: ${docRef.id}`
        );
      } else {
        const docRef = await addDoc(collection(this.db, 'products'), userData);
        console.log(`Added JSON document with ID: ${docRef.id}`);
      }
    } catch (error) {
      console.error('Fehler beim Schreiben der Dokumente (JSON):', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }

  isSaveButtonDisabled(): boolean {
    return !this.product.price || !this.product.product || !this.selectedValue;
  }

  orderType: OrderType[] = [
    { value: 'Product', viewValue: 'Product' },
    { value: 'Service', viewValue: 'Service' },
  ];
}
