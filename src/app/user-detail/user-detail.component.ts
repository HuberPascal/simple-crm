import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import {
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
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
  static convertTimestampToDate(orderDate: any): Date | null {
    throw new Error('Method not implemented.');
  }
  userId: string | null = '';
  user: User = new User();
  order: Order = new Order();
  product: Product = new Product();
  allOrders: any[] = [];
  filteredOrders: any;
  allProducts: any[] = [];

  constructor(
    public db: Firestore,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Die ID aus der URL holen
    this.route.paramMap.subscribe(async (paramMap) => {
      this.userId = paramMap.get('id');
      // this.orderId = paramMap.get('id');
      console.log('user id', this.userId);

      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (this.userId) {
        if (isAnonymous) {
          // Logik für Gastbenutzer
          this.getUser(this.userId, 'guest_users');
          this.getOrders(this.userId, 'guest_orders');
        } else {
          // Logik für angemeldete Benutzer
          this.getUser(this.userId, 'users');
          this.getOrders(this.userId, 'orders');
        }
        // this.sortOrders(); // Bestellungen der Reihe nach sortieren
      }
    });
    this.getProducts();
  }

  // User anhand der ID speichern in new User
  getUser(userId: any, user: string) {
    onSnapshot(doc(this.db, user, userId), (doc) => {
      console.log('Abgerufene Daten', doc.data());
      if (doc.exists()) {
        const userData = doc.data();
        // userData.birthDate ist ein Firebase Timestamp
        if (userData['birthDate']) {
          const userObj = this.convertTimestampToDate(userData['birthDate']);
          userData['birthDate'] = this.formatDateBirthday(userObj);
        }
        this.user = new User(userData);
        // this.user = new User(doc.data());
      } else {
        console.log('Keine Daten gefunden!');
      }
      console.log('Abgerufener User', this.user);
    });
  }

  editMenu() {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }

  editUserDetail() {
    const dialog = this.dialog.open(DialogEditUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }

  editUserAdress() {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }

  async editOrder(order: string) {
    const dialog = this.dialog.open(DialogEditOrderComponent);

    // Die Richtige Order aufrufen --> orderId
    dialog.componentInstance.order = new Order(order);
  }

  deleteUser() {
    const dialog = this.dialog.open(DialogDeleteUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }

  deleteOrder(order: string) {
    const dialog = this.dialog.open(DialogDeleteOrderComponent);

    dialog.componentInstance.order = new Order(order);
  }

  // Bestellung für den Richtigen Benutzer laden
  getOrders(userId: any, orders: string) {
    const ordersRef = collection(this.db, orders);
    const q = query(ordersRef, where('userId', '==', userId));

    onSnapshot(
      q,
      (querySnapshot) => {
        this.allOrders = []; // Array leeren, um Duplikate bei erneuten Abfragen zu verhindern
        querySnapshot.forEach((doc) => {
          const orderId = doc.id; // Hier erhalten Sie die doc-ID
          // console.log('order', orderId);
          console.log('Bestellung:', doc.data());
          const orderData = doc.data();
          orderData['orderId'] = orderId; // Fügen Sie die ID als separates Attribut hinzu

          if (orderData['orderDate']) {
            const dateObj = this.convertTimestampToDate(orderData['orderDate']);
            orderData['orderDate'] = this.formatDate(dateObj);
            this.order = new Order(orderData);
            // this.order['orderId'] = orderId; ////////////////////// evt. löschen
          }
          this.allOrders.push(new Order(orderData)); // Fügen Sie die umgewandelten Daten zum Array hinzu, um sie im HTML anzuzeigen
          this.sortOrders(); // Bestellunge der Reihe nach sortieren
        });
      },
      (error) => {
        console.error('Fehler beim Abrufen der Bestellungen: ', error);
      }
    );
  }

  private convertTimestampToDate(timestamp: any): Date | null {
    if (timestamp && typeof timestamp.seconds === 'number') {
      return new Date(timestamp.seconds * 1000);
    } else {
      return null;
    }
  }

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

  calculateTotal(): number {
    return this.allOrders.reduce(
      (total, order) => total + order.amount * order.price,
      0
    );
  }

  sortOrders() {
    this.allOrders = this.allOrders.sort((a, b) => {
      const orderA = parseFloat(a.orderDate);
      const orderB = parseFloat(b.orderDate);
      return orderA - orderB;
    });
  }

  openDialog() {
    const dialog = this.dialog.open(DialogAddOrderComponent);
    dialog.componentInstance.userId = this.userId;
    dialog.componentInstance.allProducts = this.allProducts;
    // dialog.componentInstance.order = new Order(this.order.toJSON());
  }

  formatNumberWithApostrophe(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }

  async getProducts() {
    // const firebaseData = collection(this.db, 'products');
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

    if (isAnonymous) {
      await this.getProductData('guest_products');
    } else {
      await this.getProductData('products');
    }
  }

  async getProductData(product: string) {
    try {
      const productCollectionRef = collection(this.db, product);
      onSnapshot(productCollectionRef, (snapshot) => {
        this.allProducts = [];
        snapshot.forEach((doc) => {
          const productData = doc.data();
          this.allProducts.push(productData);
          console.log('in user-detail sind all products', this.allProducts);
        });
      });
    } catch (error) {
      console.error('Fehler beim Laden der Produkt-Daten:', error);
    }
  }
}
