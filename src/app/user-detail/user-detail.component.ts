import { Component, HostListener } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { User } from '../../models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { Order } from '../../models/order.class';
import { DialogDeleteUserComponent } from '../dialog-delete-user/dialog-delete-user.component';
import { DialogEditOrderComponent } from '../dialog-edit-order/dialog-edit-order.component';
import { DialogDeleteOrderComponent } from '../dialog-delete-order/dialog-delete-order.component';
import { DialogAddOrderComponent } from '../dialog-add-order/dialog-add-order.component';
import { AuthService } from '../services/firebase-auth.service';
import { Product } from '../../models/product.class';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  orderData: any;
  static convertTimestampToDate(): Date | null {
    throw new Error('Method not implemented.');
  }
  userId: string | null = '';
  user: User = new User();
  order: Order = new Order();
  product: Product = new Product();
  allOrders: any[] = [];
  filteredOrders: any;
  allProducts: any[] = [];
  mobileView: boolean = false;
  mobileViewSmall: boolean = false;
  productNameFromOrders: any;
  productNameFromProducts: any;
  productNameFromOrdersArray: any[] = [];
  productNameFromProductsArray: any[] = [];
  loading: boolean = false;

  constructor(
    public db: Firestore,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    this.checkScreenSize600px();
    // Die ID aus der URL holen
    this.route.paramMap.subscribe(async (paramMap) => {
      this.userId = paramMap.get('id');

      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (this.userId) {
        if (isAnonymous) {
          this.getUser(this.userId, 'guest_users');
          this.getOrders(this.userId, 'guest_orders');
        } else {
          this.getUser(this.userId, 'users');
          this.getOrders(this.userId, 'orders');
        }
      }
    });
    this.getProducts();
  }

  /**
   * Retrieves user data from Firestore based on the provided user ID and collection name.
   * @param userId The ID of the user to retrieve.
   * @param user The name of the collection where user data is stored.
   */
  getUser(userId: any, user: string) {
    this.loading = true; // Ladezustand aktivieren
    onSnapshot(
      doc(this.db, user, userId),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData['birthDate']) {
            const userObj = this.convertTimestampToDate(userData['birthDate']);
            userData['birthDate'] = this.formatDateBirthday(userObj);
          }
          this.user = new User(userData);
        } else {
          console.error('Keine Daten gefunden!');
        }
        this.loading = false;
      },
      (error) => {
        console.error('Fehler beim Laden der User Daten:', error);
        this.loading = false;
      }
    );
  }

  /**
   * Retrieves orders associated with the given user ID from Firestore.
   * @param userId The ID of the user whose orders are to be retrieved.
   * @param orders The name of the collection where orders are stored.
   */
  getOrders(userId: any, orders: string) {
    this.loading = true; // Ladezustand aktivieren
    const ordersRef = collection(this.db, orders);
    const q = query(ordersRef, where('userId', '==', userId));

    onSnapshot(
      q,
      (querySnapshot) => {
        this.allOrders = [];
        querySnapshot.forEach((doc) => {
          const orderId = doc.id;
          const orderData = doc.data();
          orderData['orderId'] = orderId;
          this.getOrderData(orderData);
          this.sortOrders();
        });
        this.loading = false;
      },
      (error) => {
        console.error('Fehler beim Abrufen der Order Daten: ', error);
        this.loading = false;
      }
    );
  }

  /**
   * Processes the retrieved order data and adds it to the list of all orders.
   * @param orderData The data of the order to be processed and added.
   */
  getOrderData(orderData: any) {
    if (orderData['orderDate']) {
      const dateObj = this.convertTimestampToDate(orderData['orderDate']);
      orderData['orderDate'] = this.formatDate(dateObj);
      this.order = new Order(orderData);
    }
    this.allOrders.push(orderData);
  }

  /**
   * Opens a dialog for editing user details.
   */
  editMenu() {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }

  /**
   * Opens a dialog for editing user details.
   */
  editUserDetail() {
    const dialog = this.dialog.open(DialogEditUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userData = this.user;
    dialog.componentInstance.userId = this.userId;
  }

  /**
   * Opens a dialog for editing user address.
   */
  editUserAdress() {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }

  /**
   * Opens a dialog for adding a new order.
   */
  addOrder() {
    const dialog = this.dialog.open(DialogAddOrderComponent);
    dialog.componentInstance.userId = this.userId;
    dialog.componentInstance.allProducts = this.allProducts;
  }

  /**
   * Opens a dialog for editing an order.
   * @param order The ID of the order to be edited.
   */
  async editOrder(order: string) {
    const dialog = this.dialog.open(DialogEditOrderComponent);

    dialog.componentInstance.order = new Order(order);
    dialog.componentInstance.allProducts = this.allProducts;
    dialog.componentInstance.currentProduct = order;
  }

  /**
   * Opens a dialog for deleting a user.
   * Sets the user, userId, and allOrders properties on the dialog component.
   */
  deleteUser() {
    const dialog = this.dialog.open(DialogDeleteUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
    dialog.componentInstance.allOrders = this.allOrders;
  }

  /**
   * Opens a dialog for deleting an order.
   * @param order The ID of the order to be deleted.
   */
  deleteOrder(order: string) {
    const dialog = this.dialog.open(DialogDeleteOrderComponent);
    dialog.componentInstance.order = new Order(order);
  }

  /**
   * Converts Firestore timestamp to JavaScript Date object.
   * @param timestamp The timestamp to convert.
   * @returns A Date object representing the converted timestamp, or null if the timestamp is invalid.
   */
  private convertTimestampToDate(timestamp: any): Date | null {
    if (timestamp && typeof timestamp.seconds === 'number') {
      return new Date(timestamp.seconds * 1000);
    } else {
      return null;
    }
  }

  /**
   * Formats a Date object into a localized date string.
   * @param date The Date object to format.
   * @returns A formatted date string.
   */
  private formatDate(date: Date | null): string {
    return date
      ? date.toLocaleString('de-DE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          // hour: '2-digit',
          // minute: '2-digit',
          // second: '2-digit',
        })
      : '';
  }

  /**
   * Formats a Date object representing a birthday into a localized date string.
   * @param date The Date object representing the birthday.
   * @returns A formatted birthday date string.
   */
  private formatDateBirthday(date: Date | null): string {
    return date
      ? date.toLocaleString('de-DE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          // hour: '2-digit',
          // minute: '2-digit',
          // second: '2-digit',
        })
      : '';
  }

  /**
   * Calculates the total amount of all orders.
   * @returns The total amount of all orders.
   */
  calculateTotal(): number {
    const total = this.allOrders.reduce(
      (total, order) => total + order.amount * order.price,
      0
    );
    // Ergebnis auf zwei Dezimalstellen runden
    return parseFloat(total.toFixed(2));
  }

  /**
   * Sorts the list of orders by order date in ascending order.
   */
  sortOrders() {
    this.allOrders = this.allOrders.sort((a, b) => {
      const orderA = parseFloat(a.orderDate);
      const orderB = parseFloat(b.orderDate);
      return orderA - orderB;
    });
  }

  /**
   * Formats a number by adding apostrophes as thousand separators.
   * @param number The number to format.
   * @returns The formatted number with apostrophes as thousand separators.
   */
  formatNumberWithApostrophe(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }

  async getProducts() {
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

    if (isAnonymous) {
      await this.getProductData('guest_products');
    } else {
      await this.getProductData('products');
    }
  }

  /**
   * Retrieves product data from Firestore.
   */
  async getProductData(product: string) {
    try {
      const productCollectionRef = collection(this.db, product);
      onSnapshot(productCollectionRef, (snapshot) => {
        this.allProducts = [];
        snapshot.forEach((doc) => {
          const productData = doc.data();
          this.allProducts.push(productData);
        });
      });
    } catch (error) {
      console.error('Fehler beim Laden der Produkt-Daten:', error);
    }
  }

  /**
   * Host listener function that listens for window resize events.
   * It triggers the checkScreenSize method when the window is resized.
   * @param {any} event - The window resize event object.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
    this.checkScreenSize600px();
  }

  /**
   * Checks the screen size and adjusts the drawer mode accordingly.
   * If the window width is less than 1100 pixels, sets mobileView to true, else sets it to false.
   */
  checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.mobileView = window.innerWidth < 1100;
      if (this.mobileView) {
        this.mobileView = true;
      } else {
        this.mobileView = false;
      }
    }
  }

  /**
   * Checks the screen size and adjusts the drawer mode accordingly.
   * If the window width is less than 600 pixels, sets mobileView to true, else sets it to false.
   */
  checkScreenSize600px() {
    if (typeof window !== 'undefined') {
      this.mobileViewSmall = window.innerWidth < 600;
      if (this.mobileViewSmall) {
        this.mobileViewSmall = true;
      } else {
        this.mobileViewSmall = false;
      }
    }
  }
}
