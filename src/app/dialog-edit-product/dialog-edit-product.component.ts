import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.class';
import { MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';

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
    private database: DatabaseService
  ) {}

  ngOnInit() {
    this.selectedValue = this.product.orderType;
  }

  /**
   * Updates the product data in the database.
   */
  async saveProduct() {
    this.loading = true;
    try {
      const productData = this.product;
      const productId = this.product['productId'];
      const selectedProductType = this.selectedValue;
      this.product.orderType = selectedProductType;
      productData.price = this.product.price;
      this.database.updateProduct(productData, productId);
      console.log('product data ist', productData);
      this.database.updateOrder(productData.price, productId);
    } catch (error) {
      console.error('Fehler beim updaten des Produkts:', error);
    }
    this.loading = false;
    this.dialogRef.close();
  }

  /**
   * Only releases the save button when all fields have been filled out
   * @returns {boolean} Returns true if all is valid, otherwise false.
   */
  isSaveButtonDisabled(): boolean {
    return !this.product.price;
  }

  /**
   * Provides the value for the productType input field
   */
  productType: ProductType[] = [
    { value: 'Product', viewValue: 'Product' },
    { value: 'Service', viewValue: 'Service' },
  ];
}
