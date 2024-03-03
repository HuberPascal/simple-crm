import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export class Order {
  orderDate: Date | null;
  amount: number;
  product: string | undefined;
  orderStatus: string | undefined;
  price: number;
  userId: string | null;
  orderId: string;

  constructor(obj?: any) {
    this.orderDate = obj ? obj.orderDate : '';
    this.amount = obj ? obj.amount : '';
    this.product = obj ? obj.product : '';
    this.orderStatus = obj ? obj.orderStatus : '';
    this.price = obj ? obj.price : '';
    this.userId = obj ? obj.userId : '';
    this.orderId = obj ? obj.orderId : '';
  }

  public toJSON() {
    let orderDateTimestamp = null;

    // überprüfen ob OrderDate das richtige Format hat
    if (this.orderDate instanceof Date) {
      orderDateTimestamp = firebase.firestore.Timestamp.fromDate(
        this.orderDate
      );
    }

    return {
      orderDate: orderDateTimestamp,
      amount: this.amount,
      product: this.product,
      orderStatus: this.orderStatus,
      price: this.price,
      userId: this.userId,
      orderId: this.orderId,
    };
  }
}
