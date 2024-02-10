import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export class Product {
  product: string;
  price: number;
  orderId: string;
  service: string;

  constructor(obj?: any) {
    this.product = obj ? obj.product : '';
    this.price = obj ? obj.price : '';
    this.orderId = obj ? obj.orderId : ''; // Initialisieren der userId
    this.service = obj ? obj.service : '';
  }

  public toJSON() {
    return {
      product: this.product,
      price: this.price,
      orderId: this.orderId,
      service: this.service,
    };
  }
}
