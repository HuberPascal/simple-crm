import { Injectable } from '@angular/core';
import { AuthService } from './firebase-auth.service';
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  isAnonymous: boolean = false;
  userId!: string | null;
  orderId!: string | null;
  productId!: string | null;

  constructor(
    private authService: AuthService,
    public db: Firestore,
    private router: Router
  ) {}

  ////////// Save //////////

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

      this.saveOrderInFirebase(orderData);
    } catch (error) {
      console.error('Fehler beim Schreiben der Bestellung:', error);
    }
  }

  /**
   * Saves the order data to Firebase.
   * @param orderData
   */
  async saveOrderInFirebase(orderData: any) {
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
      this.saveProductInFirebase(productData);
    } catch (error) {
      console.error('Fehler beim Schreiben der Produkte Bestellung:', error);
    }
  }

  /**
   * Saves the product data to Firebase.
   *
   * @param productData
   */
  async saveProductInFirebase(productData: any) {
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

  ////////// Update //////////

  /**
   * Provide the user data for firebase to update the document.
   * @param userData
   * @param userId
   */
  async updateUser(userData: any | null, userId: string | null) {
    this.userId = userId;
    let firebaseData: any;

    try {
      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        firebaseData = this.guestUserFirebaseData();
      } else {
        firebaseData = this.userFirebaseData();
      }
      await this.updateUserDataInFirebase(firebaseData, userData);
    } catch (error) {
      console.error('Fehler beim updaten des Users:', error);
    }
  }

  /**
   * Updates the user data in firebase.
   * @param userData
   */
  async updateUserDataInFirebase(firebaseData: any, userData: any | null) {
    await updateDoc(firebaseData, {
      street: userData.street,
      zipCode: userData.zipCode,
      city: userData.city,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      birthDate: userData.birthDate,
    });
  }

  /**
   * Returns the Firebase document reference for a guest user.
   * @returns {Object} The Firebase document reference for the guest user.
   */
  guestUserFirebaseData(): object {
    return doc(this.db, 'guest_users', `${this.userId}`);
  }

  /**
   * Returns the Firebase document reference for a user.
   * @returns {Object} The Firebase document reference for the user.
   */
  userFirebaseData(): object {
    return doc(this.db, 'users', `${this.userId}`);
  }

  /**
   * Provide the order data for firebase to update the document.
   * @param orderData
   * @param orderId
   */
  async updateOrder(orderData: any | undefined, orderId: string) {
    let docRef: any;
    this.orderId = orderId;

    try {
      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        docRef = this.guestOrderFirebaseData();
      } else {
        docRef = this.userOrderFirebaseData();
      }
      await this.updateOrderDataInFirebase(docRef, orderData);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Dokuments:', error);
    }
  }

  /**
   * Updates the order data in firebase.
   * @param docRef
   * @param orderData
   */
  async updateOrderDataInFirebase(docRef: any, orderData: any | undefined) {
    await updateDoc(docRef, {
      amount: orderData.amount,
      orderStatus: orderData.orderStatus,
    });
  }

  /**
   * Returns the Firebase document reference for a guets order.
   * @returns {Object} The Firebase document reference for the guest order.
   */
  guestOrderFirebaseData(): object {
    return doc(this.db, 'guest_orders', `${this.orderId}`);
  }

  /**
   * Returns the Firebase document reference for a order.
   * @returns {Object} The Firebase document reference for the order.
   */
  userOrderFirebaseData(): object {
    return doc(this.db, 'orders', `${this.orderId}`);
  }

  /**
   * Provide the product data for firebase to update the document.
   * @param productData
   * @param productId
   */
  async updateProduct(productData: any | null, productId: string) {
    let docRef: any;
    this.productId = productId;

    try {
      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        docRef = this.guestUserProductFirebaseData();
      } else {
        docRef = this.userProductFirebaseData();
      }
      await this.updateProductDataInFirebase(docRef, productData);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Dokuments:', error);
    }
  }

  /**
   * Updates the order data in firebase.
   * @param docRef
   * @param productData
   */
  async updateProductDataInFirebase(docRef: any, productData: any) {
    try {
      await updateDoc(docRef, {
        productName: productData.productName,
        price: productData.price,
        orderType: productData.orderType,
      });
    } catch (error) {
      console.error('Fehler beim updaten der Produkte in Firebase:', error);
    }
  }

  /**
   * Returns the Firebase document reference for a product.
   * @returns {Object} The Firebase document reference for the guest product.
   */
  guestUserProductFirebaseData(): object {
    return doc(this.db, 'guest_products', `${this.productId}`);
  }

  /**
   * Returns the Firebase document reference for a product.
   * @returns {Object} The Firebase document reference for the product.
   */
  userProductFirebaseData(): object {
    return doc(this.db, 'products', `${this.productId}`);
  }
  ////////// Delete //////////

  /**
   * Delete the order in Firebase.
   * @param orderId
   */
  async deleteOrder(orderId: string) {
    try {
      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        await deleteDoc(doc(this.db, 'guest_orders', `${orderId}`));
      } else {
        await deleteDoc(doc(this.db, 'orders', `${orderId}`));
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzers: ', error);
    }
  }

  /**
   * Delete the product in Firebase.
   * @param productId
   */
  async deleteProduct(productId: string) {
    try {
      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        await deleteDoc(doc(this.db, 'guest_products', `${productId}`));
      } else {
        await deleteDoc(doc(this.db, 'products', `${productId}`));
      }
    } catch (error) {
      console.error('Fehler beim löschen des Produkts: ', error);
    }
  }

  /**
   * Delete the User in Firebase.
   * @param productId
   */
  async deleteUser(userId: string | null) {
    try {
      const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

      if (isAnonymous) {
        await deleteDoc(doc(this.db, 'guest_users', `${userId}`));
        this.router.navigate(['guest/user']);
      } else {
        await deleteDoc(doc(this.db, 'users', `${userId}`));
        this.router.navigate(['/user']);
      }
    } catch (error) {
      console.error('Fehler beim löschen des Benutzers: ', error);
    }
  }
}
