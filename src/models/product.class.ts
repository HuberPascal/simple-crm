import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export class Product {
  productName: string;
  price: number;
  orderType: string | undefined;
  productId: string;

  constructor(obj?: any) {
    this.productName = obj ? obj.productName : '';
    this.price = obj ? obj.price : '';
    this.orderType = obj ? obj.orderType : '';
    this.productId = obj ? obj.productId : '';
  }

  public toJSON() {
    return {
      productName: this.productName,
      price: this.price,
      orderType: this.orderType,
    };
  }
}
