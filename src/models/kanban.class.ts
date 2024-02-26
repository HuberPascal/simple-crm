export class Kanban {
  note: string = '';
  firstName: string = '';
  lastName: string = '';
  price: number;
  kanbanStatus: string = '';

  constructor(obj?: any) {
    this.note = obj ? obj.note : '';
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.price = obj ? obj.price : '';
    this.kanbanStatus = obj ? obj.kanbanStatus : '';
  }

  public toJSON() {
    return {
      note: this.note,
      firstName: this.firstName,
      lastName: this.lastName,
      price: this.price,
      kanbanStatus: this.kanbanStatus,
    };
  }
}
