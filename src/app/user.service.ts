import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isGuestUser: boolean = false;

  constructor(public db: Firestore) {}
}
