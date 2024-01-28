import { UserDetailComponent } from '../app/user-detail/user-detail.component';

export class Order {
  // [x: string]: any;
  orderDate: Date | null; // Erlaubt sowohl Date-Objekte als auch null
  amount: number;
  product: string;
  orderStatus: string;
  price: number;
  userId: number; // Hinzufügen der userId als Eigenschaft
  orderId: string;

  constructor(obj?: any) {
    this.orderDate = obj ? obj.orderDate : '-';
    this.amount = obj ? obj.amount : '-';
    this.product = obj ? obj.product : '-';
    this.orderStatus = obj ? obj.orderStatus : '-';
    this.price = obj ? obj.price : '-';
    this.userId = obj ? obj.userId : '-'; // Initialisieren der userId
    this.orderId = obj ? obj.orderId : '-'; // Initialisieren der userId
  }

  public toJSON() {
    return {
      orderDate: this.orderDate ? this.orderDate.getTime() : null,
      amount: this.amount,
      product: this.product,
      orderStatus: this.orderStatus,
      price: this.price,
      userId: this.userId,
      orderId: this.orderId,
    };
  }
}
