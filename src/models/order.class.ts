import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export class Order {
  orderDate: Date | null; // Erlaubt sowohl Date-Objekte als auch null
  amount: number;
  product: string;
  orderStatus: string | undefined;
  price: number;
  userId: string | null; // Hinzufügen der userId als Eigenschaft
  orderId: string;

  constructor(obj?: any) {
    this.orderDate = obj ? obj.orderDate : '';
    this.amount = obj ? obj.amount : '';
    this.product = obj ? obj.product : '';
    this.orderStatus = obj ? obj.orderStatus : '';
    this.price = obj ? obj.price : '';
    this.userId = obj ? obj.userId : ''; // Initialisieren der userId
    this.orderId = obj ? obj.orderId : ''; // Initialisieren der userId
  }

  public toJSON() {
    return {
      orderDate: this.orderDate
        ? firebase.firestore.Timestamp.fromDate(this.orderDate)
        : null,
      amount: this.amount,
      product: this.product,
      orderStatus: this.orderStatus,
      price: this.price,
      userId: this.userId,
      orderId: this.orderId,
    };
  }
}
