export class Kanban {
  taskId: string = '';
  note: string = '';
  firstName: string = '';
  lastName: string = '';
  price: number;
  noteStatus: string = '';

  constructor(obj?: any) {
    this.taskId = obj ? obj.taskId : '';
    this.note = obj ? obj.note : '';
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.price = obj ? obj.price : '';
    this.noteStatus = obj ? obj.noteStatus : '';
  }

  public toJSON() {
    return {
      taskId: this.taskId,
      note: this.note,
      firstName: this.firstName,
      lastName: this.lastName,
      price: this.price,
      noteStatus: this.noteStatus,
    };
  }
}
