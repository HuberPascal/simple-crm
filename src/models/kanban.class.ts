export class Kanban {
  node: string = '';
  firstName: string = '';
  lastName: string = '';
  price: number;

  constructor(obj?: any) {
    this.node = obj ? obj.node : '';
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.price = obj ? obj.price : '';
  }
}
