import { Injectable } from '@angular/core';
import { AuthService } from './firebase-auth.service';
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  where,
  query,
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
  taskId!: string | null;

  constructor(
    private authService: AuthService,
    public db: Firestore,
    private router: Router
  ) {}

  /**
   * Check if the user is anonymous.
   */
  async checkIsAnonymous() {
    this.isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
  }

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
        orderData.currentProductId = selectedProduct.currentProductId;
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
      if (this.isAnonymous) {
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
      if (this.isAnonymous) {
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
      if (this.isAnonymous) {
        await addDoc(collection(this.db, 'guest_users'), userData);
      } else {
        await addDoc(collection(this.db, 'users'), userData);
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Bestellung:', error);
    }
  }

  async saveNote(
    note: string,
    kanbanData: any,
    selectedStatus: string,
    selectedUserFirstName: string,
    selectedUserLastName: string
  ) {
    kanbanData.note = note;
    kanbanData.noteStatus = selectedStatus;

    if (selectedUserFirstName) {
      kanbanData.firstName = selectedUserFirstName;
      kanbanData.lastName = selectedUserLastName;
    }

    this.saveNoteInFirebase(kanbanData);
  }

  async saveNoteInFirebase(kanbanData: any) {
    try {
      if (this.isAnonymous) {
        await addDoc(collection(this.db, 'guest_kanban'), kanbanData);
      } else {
        await addDoc(collection(this.db, 'kanban'), kanbanData);
      }
    } catch {}
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
      if (this.isAnonymous) {
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
    if (userData && userData.birthDate !== undefined) {
      await updateDoc(firebaseData, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        birthDate: userData.birthDate,
      });
    }
  }

  /**
   * Provide the user data for firebase to update the document.
   * @param userData
   * @param userId
   */
  async updateUserAdress(userData: any | null, userId: string | null) {
    this.userId = userId;
    let firebaseData: any;

    try {
      if (this.isAnonymous) {
        firebaseData = this.guestUserFirebaseData();
      } else {
        firebaseData = this.userFirebaseData();
      }
      await this.updateUserAdressDataInFirebase(firebaseData, userData);
    } catch (error) {
      console.error('Fehler beim updaten des Users:', error);
    }
  }

  /**
   * Updates the user data in firebase.
   * @param userData
   */
  async updateUserAdressDataInFirebase(
    firebaseData: any,
    userData: any | null
  ) {
    if (userData && userData.birthDate !== undefined) {
      await updateDoc(firebaseData, {
        street: userData.street,
        zipCode: userData.zipCode,
        city: userData.city,
      });
    }
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
      if (this.isAnonymous) {
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
      product: orderData.product,
      price: orderData.price,
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
      if (this.isAnonymous) {
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

  async updateTask(taskData: any, taskId: string) {
    let docRef: any;
    this.taskId = taskId;

    try {
      if (this.isAnonymous) {
        docRef = this.getGuestTaskFirebaseData();
      } else {
        docRef = this.getTaskFirebaseData();
      }
      this.updateTaskInFirebase(docRef, taskData, taskId);
    } catch (error) {
      console.error('Fehler beim Updaten der Task Daten', error);
    }
  }

  /**
   * Updates the task data in firebase.
   * @param docRef
   * @param taskData
   */
  async updateTaskInFirebase(docRef: any, taskData: any, taskId: string) {
    try {
      await updateDoc(docRef, {
        firstName: taskData.firstName,
        lastName: taskData.lastName,
        note: taskData.note,
        noteStatus: taskData.noteStatus,
        taskId: taskId,
      });
    } catch (error) {
      console.error('Fehler beim updaten des Tasks in Firebase', error);
    }
  }

  /**
   * Returns the Firebase document reference for a task.
   * @returns {Object} The Firebase document reference for the guest task.
   */
  getGuestTaskFirebaseData(): object {
    return doc(this.db, 'guest_kanban', `${this.taskId}`);
  }

  /**
   * Returns the Firebase document reference for a task.
   * @returns {Object} The Firebase document reference for the guest task.
   */
  getTaskFirebaseData(): object {
    return doc(this.db, 'kanban', `${this.taskId}`);
  }

  ////////// Delete //////////

  /**
   * Delete the order in Firebase.
   * @param orderId
   */
  async deleteOrder(orderId: string) {
    try {
      if (this.isAnonymous) {
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
      if (this.isAnonymous) {
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
      if (this.isAnonymous) {
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

  /**
   * Delete the Task in Firebase.
   * @param productId
   */
  async deleteTask(taskId: any) {
    if (this.isAnonymous) {
      await deleteDoc(doc(this.db, 'guest_kanban', `${taskId}`));
    } else {
      await deleteDoc(doc(this.db, 'kanban', `${taskId}`));
    }
  }

  /**
   * Asynchronously updates an order from products.
   *
   * @param {any | undefined} orderData - Data of the order to be updated.
   * @param {string} orderId - ID of the order to be updated.
   */
  async updateOrderFromProducts(orderData: any | undefined, orderId: string) {
    let docRef: any;
    this.orderId = orderId;

    try {
      if (this.isAnonymous) {
        docRef = this.guestOrderFirebaseData();
      } else {
        docRef = this.userOrderFirebaseData();
      }
      await this.updateOrderDataInFirebaseFromProducts(docRef, orderData);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Dokuments:', error);
    }
  }

  /**
   * Asynchronously updates order data in Firebase from products.
   *
   * @param {any} docRef - Reference to the document in Firebase.
   * @param {any | undefined} orderData - Data of the order.
   */
  async updateOrderDataInFirebaseFromProducts(
    docRef: any,
    orderData: any | undefined
  ) {
    await updateDoc(docRef, {
      product: orderData.product,
    });
  }

  /**
   * Asynchronously updates data in Firebase orders.
   *
   * @param {string} productId - ID of the product.
   * @param {string} newProductName - New name of the product.
   * @param {number} productPrice - New price of the product.
   */
  async updateDataInFirebaseOrders(
    productId: string,
    newProductName: string,
    productPrise: number
  ) {
    let productsRef: any;
    try {
      if (this.isAnonymous) {
        productsRef = collection(this.db, 'guest_orders');
      } else {
        productsRef = collection(this.db, 'orders');
      }
      await this.updateDataInFirebaseOrdersFromEditProducts(
        productId,
        newProductName,
        productPrise,
        productsRef
      );
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Dokuments:', error);
    }
  }

  /**
   * Asynchronously updates data in Firebase orders from editing products.
   *
   * @param {string} productId - ID of the product.
   * @param {string} newProductName - New name of the product.
   * @param {number} productPrice - New price of the product.
   * @param {any} productsRef - Reference to the products collection in Firebase.
   */
  async updateDataInFirebaseOrdersFromEditProducts(
    productId: string,
    newProductName: string,
    productPrice: number,
    productsRef: any
  ) {
    try {
      const currentProductId = productId;
      const q = this.createQIs(productsRef, currentProductId);
      const querySnapshot = await getDocs(q);
      await this.updateDocuments(querySnapshot, newProductName, productPrice);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Produkte:', error);
    }
  }

  /**
   * Asynchronously updates documents based on the query snapshot.
   *
   * @param {any} querySnapshot - Snapshot of the query result.
   * @param {string} newProductName - New name of the product.
   * @param {number} productPrice - New price of the product.
   */
  async updateDocuments(
    querySnapshot: any,
    newProductName: string,
    productPrice: number
  ) {
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doc: any) => {
        const docRef = doc.ref;
        await updateDoc(docRef, {
          product: newProductName,
          price: productPrice,
        });
      });
    } else {
    }
  }

  /**
   * Creates a query to filter products by the current product ID.
   *
   * @param {any} productsRef - Reference to the products collection in Firebase.
   * @param {string} currentProductId - Current product ID.
   */
  createQIs(productsRef: any, currentProductId: string) {
    return query(
      productsRef,
      where('currentProductId', '==', currentProductId)
    );
  }
}
