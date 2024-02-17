import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './firebase-auth.service';
import { collection, addDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService implements OnInit {
  isAnonymous: boolean = false;

  constructor(private authService: AuthService, public db: Firestore) {}

  async ngOnInit(): Promise<void> {
    this.isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
  }

  async saveOrder(
    userId: string | null,
    orderData: any | undefined,
    selectedValue: string | undefined,
    selectedProduct: any
  ) {
    try {
      orderData.userId = userId;

      if (selectedProduct) {
        orderData.product = selectedProduct.name;
        orderData.price = selectedProduct.price;
      }

      orderData.orderStatus = selectedValue;

      this.saveOrderToFirebase(orderData);
    } catch (error) {
      console.error('Fehler beim Schreiben der Bestellung:', error);
    }
  }

  private async saveOrderToFirebase(orderData: any) {
    try {
      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        await addDoc(collection(this.db, 'guest_orders'), orderData);
        console.log('Bestellung erfolgreich als Gast gespeichert');
      } else {
        await addDoc(collection(this.db, 'orders'), orderData);
        console.log('Bestellung erfolgreich gespeichert');
      }
    } catch (error) {
      throw new Error(
        'Fehler beim Speichern der Bestellung in Firebase: ' + error
      );
    }
  }
}
