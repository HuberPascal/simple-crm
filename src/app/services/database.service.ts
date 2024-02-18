import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './firebase-auth.service';
import { collection, addDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { AnyAaaaRecord } from 'dns';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService implements OnInit {
  isAnonymous: boolean = false;

  constructor(private authService: AuthService, public db: Firestore) {}

  async ngOnInit() {}

  /**
   * Provides the data for loading into firebase.
   * @param userId
   * @param orderData
   * @param selectedValue
   * @param selectedProduct
   */
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

  /**
   * Saves the order data to Firebase.
   * @param orderData
   */
  async saveOrderToFirebase(orderData: any) {
    try {
      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        await addDoc(collection(this.db, 'guest_orders'), orderData);
      } else {
        await addDoc(collection(this.db, 'orders'), orderData);
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Bestellung in Firebase:', error);
    }
  }

  /**
   * Provides the data for loading into firebase
   * @param productData
   * @param selectedTypeStatus
   */
  async saveProduct(
    productData: any | undefined,
    selectedTypeStatus: string | undefined
  ) {
    try {
      productData.orderType = selectedTypeStatus;
      this.saveProductToFirebase(productData);
    } catch (error) {
      console.error('Fehler beim Schreiben der Produkte Bestellung:', error);
    }
  }

  /**
   * Saves the product data to Firebase.
   *
   * @param productData
   */
  async saveProductToFirebase(productData: any) {
    try {
      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        await addDoc(collection(this.db, 'guest_products'), productData);
      } else {
        await addDoc(collection(this.db, 'products'), productData);
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Bestellung in Firebase:', error);
    }
  }

  /**
   * Saves the user data to Firebase.
   * @param userData
   */
  async saveUser(userData: any) {
    try {
      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        await addDoc(collection(this.db, 'guest_users'), userData);
      } else {
        await addDoc(collection(this.db, 'users'), userData);
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Bestellung:', error);
    }
  }
}
