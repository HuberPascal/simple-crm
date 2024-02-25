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
  filteredProductsInputField: any[] = []; // Gefilterte Benutzerdaten vom Suchfeld
  filterInputValue: any; // Eingabe vom Suchfeld
  filterNotFound: boolean = false;

  constructor(
    private authService: AuthService,
    public db: Firestore,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

    if (isAnonymous) {
      await this.getOrderData('guest_products');
    } else {
      await this.getOrderData('products');
    }
  }

  /**
   * Fetches order data from the specified collection in the Firestore database.
   *
   * @param {string} product - The name of the collection from which to fetch user data.
   */
  async getOrderData(product: string) {
    try {
      const productCollectionRef = collection(this.db, product);
      this.getOrderDataSnapShot(productCollectionRef);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Produkte-Daten:', error);
    }
  }

  /**
   * Listens for changes in the specified collection and updates the `allProducts` array accordingly.
   * Additionally, it triggers the `filterProducts()` method to filter the order data.
   *
   * @param {any} productCollectionRef - The reference to the collection in Firestore.
   */
  getOrderDataSnapShot(productCollectionRef: any) {
    onSnapshot(productCollectionRef, (snapshot: { docs: any[] }) => {
      this.allProducts = [];
      snapshot.docs.forEach((doc) => {
        const productData = doc.data();
        const productId = doc.id;
        productData['productId'] = productId;
        this.allProducts.push(productData);
      });
      this.filterProducts();
    });
  }

  /**
   * Opens a dialog to add a new product.
   */
  openDialog() {
    this.dialog.open(DialogAddProductComponent);
  }

  /**
   * Edits a product.
   *
   * @param {string} product - The name of the product to edit.
   */
  async editProduct(product: string) {
    const dialog = this.dialog.open(DialogEditProductComponent);
    dialog.componentInstance.product = new Product(product);
  }

  /**
   * Deletes a product.
   *
   * @param {string} product - The name of the product to delete.
   */
  async deleteProduct(product: string) {
    const dialog = this.dialog.open(DialogDeleteProductComponent);
    dialog.componentInstance.product = new Product(product);
  }

  /**
   * Filters the products based on the selected filter.
   */
  filterProducts() {
    switch (this.selectedFilter) {
      case 'Product Name':
        this.filterByProductName();
        break;
      case 'Price per Unit':
        this.filterByPricePerUnit();
        break;
      case 'Type':
        this.filterByType();
        break;
      default:
        this.filteredProducts = this.allProducts;
        break;
    }
  }

  /**
   * Filters the products by product name.
   * Sorts the products alphabetically based on the product name.
   */
  filterByProductName() {
    if (this.allProducts.length > 1) {
      this.filteredProducts = this.allProducts.sort((a, b) =>
        a.productName.localeCompare(b.productName)
      );
    } else {
      this.filteredProducts = this.allProducts;
    }
  }

  /**
   * Filters the products by price per unit.
   * Sorts the products by price in ascending order.
   */
  filterByPricePerUnit() {
    this.filteredProducts = this.allProducts.sort((a, b) => a.price - b.price);
  }

  /**
   * Filters the products by type.
   * Sorts the products alphabetically based on the type.
   */
  filterByType() {
    this.filteredProducts = this.allProducts.sort((a, b) =>
      a.orderType.localeCompare(b.orderType)
    );
  }

  /**
   * Filters the products based on the selected filter.
   */
  filterProductFromInput(): void {
    if (this.selectedFilter === 'Product Name') {
      this.filterProductName();
    } else if (this.selectedFilter === 'Price per Unit') {
      this.filterPricePerUnit();
    } else if (this.selectedFilter === 'Type') {
      this.filterProductType();
    }
    this.checkFilterNotFound();
  }

  /**
   * Filters the products based on the product name and updates the array of filtered products.
   *
   * @returns {Array} An array of filtered products.
   */
  filterProductName(): Array<any> {
    return (this.filteredProductsInputField = this.allProducts.filter(
      (product) =>
        product.productName
          .toLowerCase()
          .startsWith(this.filterInputValue.toLowerCase())
    ));
  }

  /**
   * Filters the products based on the price and updates the array of filtered products.
   *
   * @returns {Array} An array of filtered products.
   */
  filterPricePerUnit(): Array<any> {
    return (this.filteredProductsInputField = this.allProducts.filter(
      (product) => product.price.toString().startsWith(this.filterInputValue)
    ));
  }

  /**
   * Filters the products based on the product type and updates the array of filtered products.
   *
   * @returns {Array} An array of filtered products.
   */
  filterProductType(): Array<any> {
    return (this.filteredProductsInputField = this.allProducts.filter(
      (product) =>
        product.orderType
          .toLowerCase()
          .includes(this.filterInputValue.toLowerCase())
    ));
  }

  /**
   * Checks if the filter input value is not empty and if the filtered products array is empty.
   *
   * @returns {void}
   */
  checkFilterNotFound(): void {
    if (
      this.filterInputValue !== '' &&
      this.filteredProductsInputField.length == 0
    ) {
      this.filterNotFound = true;
    } else {
      this.filterNotFound = false;
    }
  }
}
