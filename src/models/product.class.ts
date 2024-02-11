import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export class Product {
  product: string;
  price: number;
  orderType: string | undefined;

  constructor(obj?: any) {
    this.product = obj ? obj.product : '';
    this.price = obj ? obj.price : '';
    this.orderType = obj ? obj.orderType : '';
  }

  public toJSON() {
    return {
      product: this.product,
      price: this.price,
      orderType: this.orderType,
    };
  }
}
