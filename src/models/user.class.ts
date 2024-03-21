import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export class User {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date | null;
  street: string;
  zipCode: number;
  city: string;

  constructor(obj?: any) {
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.email = obj ? obj.email : '';
    this.birthDate = obj ? obj.birthDate : '';
    this.street = obj ? obj.street : '';
    this.zipCode = obj ? obj.zipCode : '';
    this.city = obj ? obj.city : '';
  }

  public toJSON() {
    let birthdayDateTimestamp = null;

    // Überprüfen, ob birthDate ein gültiges Date-Objekt ist und nicht null ist
    if (this.birthDate instanceof Date && !isNaN(this.birthDate.getTime())) {
      birthdayDateTimestamp = firebase.firestore.Timestamp.fromDate(
        this.birthDate
      );
    }
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      birthDate: birthdayDateTimestamp,
      street: this.street,
      zipCode: this.zipCode,
      city: this.city,
    };
  }
}
