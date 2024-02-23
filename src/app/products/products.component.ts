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
  selectedFilter: string = 'Product Name'; // Standardmäßig nach 'Product Name' filtern
  filteredProducts: any[] = []; // Gefilterte Benutzerdaten
  filteredProductsInputField: any[] = [];
  filter: any;

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
        this.filterProducts();
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

  // User Filtern
  filterProducts() {
    switch (this.selectedFilter) {
      case 'Product Name':
        this.filteredProducts = this.allProducts.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case 'Price per Unit':
        this.filteredProducts = this.allProducts.sort(
          (a, b) => a.price - b.price
        );
        break;
      case 'Type':
        this.filteredProducts = this.allProducts.sort((a, b) =>
          a.orderType.localeCompare(b.orderType)
        );
        break;
      default:
        this.filteredProducts = this.allProducts;
        break;
    }
  }

  filterProduct(): void {
    console.log(this.allProducts);
    if (this.selectedFilter === 'Product Name') {
      this.filteredProductsInputField = this.allProducts.filter((product) =>
        product.productName.toLowerCase().startsWith(this.filter.toLowerCase())
      );
      this.filteredProductsInputField;
    } else if (this.selectedFilter === 'Price per Unit') {
      this.filteredProductsInputField = this.allProducts.filter((product) =>
        product.price.toString().startsWith(this.filter)
      );
    } else if (this.selectedFilter === 'Type') {
      this.filteredProductsInputField = this.allProducts.filter((product) =>
        product.orderType.toLowerCase().includes(this.filter.toLowerCase())
      );
    }
  }
}
