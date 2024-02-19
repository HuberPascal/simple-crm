import { Injectable } from '@angular/core';
import { AuthService } from './firebase-auth.service';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationDatabaseService {
  constructor(
    private authService: AuthService,
    public db: Firestore,
    private router: Router
  ) {}
}
