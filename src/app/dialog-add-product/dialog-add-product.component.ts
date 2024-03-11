import { Component } from '@angular/core';
import { Product } from '../../models/product.class';
import { MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';

interface ProductType {
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
    private database: DatabaseService
  ) {}

  /**
   * Save Data from the form in Firebase and close the dialog box.
   */
  async saveProduct() {
    this.loading = true;
    try {
      const productData = this.product.toJSON();
      const selectedTypeStatus = this.selectedValue;
      productData.currentProductId = this.generateRandomProductId(10);

      await this.database.saveProduct(productData, selectedTypeStatus);
    } catch (error) {
      console.error('Fehler beim Schreiben der Dokumente (JSON):', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }

  /**
   * Generates a random product ID of the specified length.
   * @param {number} length The length of the generated product ID.
   */
  generateRandomProductId(length: number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Only releases the save button when all fields have been filled out
   * @returns {boolean} Returns true if all is valid, otherwise false.
   */
  isSaveButtonDisabled(): boolean {
    return (
      !this.product.price ||
      this.product.price < 0 ||
      !this.product.productName ||
      !this.selectedValue
    );
  }

  /**
   * Provides the value for the Product Type input field
   */
  productType: ProductType[] = [
    { value: 'Product', viewValue: 'Product' },
    { value: 'Service', viewValue: 'Service' },
  ];
}
