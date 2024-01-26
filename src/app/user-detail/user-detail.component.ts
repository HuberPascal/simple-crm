import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import {
  collection,
  doc,
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

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  static convertTimestampToDate(orderDate: any): Date | null {
    throw new Error('Method not implemented.');
  }
  userId: string | null = '';
  orderId: string | null = '';
  user: User = new User();
  order: Order = new Order();
  allOrders: any[] = [];

  constructor(
    public db: Firestore,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // Die ID aus der URL holen
    this.route.paramMap.subscribe((paramMap) => {
      this.userId = paramMap.get('id');
      // this.orderId = paramMap.get('id');
      console.log('user id', this.userId);
      if (this.userId) {
        this.getUser(this.userId);
        this.getOrders(this.userId);
      }
    });
  }

  // User anhand der ID speichern in new User
  getUser(userId: any) {
    onSnapshot(doc(this.db, 'users', userId), (doc) => {
      console.log('ich rufe die daten ab', doc.data());
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

  deleteUser() {
    const dialog = this.dialog.open(DialogDeleteUserComponent);
    dialog.componentInstance.userId = this.userId;
  }

  // getOrders(userId: any) {
  //   onSnapshot(doc(this.db, 'orders', userId), (doc) => {
  //     console.log('ich rufe die daten ab', doc.data());
  //     if (doc.exists()) {
  //       // this.order = new Order(doc.data());
  //       const orderData = doc.data();

  //       if (orderData['orderDate']) {
  //         const dateObj = this.convertTimestampToDate(orderData['orderDate']);
  //         orderData['orderDate'] = this.formatDate(dateObj);
  //       }
  //       this.order = new Order(orderData);
  //     } else {
  //       console.log('Keine Daten gefunden!');
  //     }
  //     console.log('Abgerufener Orders', this.order);
  //   });
  // }

  getOrders(userId: string) {
    const ordersRef = collection(this.db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));

    onSnapshot(
      q,
      (querySnapshot) => {
        this.allOrders = []; // Array leeren, um Duplikate bei erneuten Abfragen zu verhindern
        querySnapshot.forEach((doc) => {
          console.log('Bestellung:', doc.data());
          const orderData = doc.data();

          if (orderData['orderDate']) {
            const dateObj = this.convertTimestampToDate(orderData['orderDate']);
            orderData['orderDate'] = this.formatDate(dateObj);
            this.order = new Order(orderData);
          }
          this.allOrders.push(new Order(orderData)); // Fügen Sie die umgewandelten Daten zum Array hinzu um es im HTML anzuzeigen
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
          hour: '2-digit',
          minute: '2-digit',
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
}
