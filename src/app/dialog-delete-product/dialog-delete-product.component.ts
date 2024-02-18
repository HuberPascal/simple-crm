import { Component } from '@angular/core';
import { Product } from '../../models/product.class';
import { MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';

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
    private database: DatabaseService
  ) {}

  /**
   * Delete Product Data in Firebase and close the dialog box.
   */
  async deleteProduct() {
    this.loading = true;

    try {
      const productId = this.product['productId'];
      this.database.deleteProduct(productId);
    } catch (error) {
      console.error('Fehler beim löschen des Produkts:', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }
}
