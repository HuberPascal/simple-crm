import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import {
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: any;

  constructor(private auth: Auth) {}

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  guestLogin() {
    return signInAnonymously(this.auth);
  }

  googleLogin() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  appleLogin() {
    const provider = new OAuthProvider('apple.com');
    return signInWithPopup(this.auth, provider);
  }

  /**
   * Checks the authentication state of the user.
   * @returns A promise that resolves to a boolean value indicating whether the user is authenticated or not.
   */
  checkAuth() {
    return new Promise<boolean>(async (resolve, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user && !user.isAnonymous) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  checkAuthLoggedInAsGuest() {
    return new Promise<boolean>((resolve, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          // Überprüfen Sie, ob der Benutzer anonym angemeldet ist
          const isAnonymous = user.isAnonymous;
          resolve(isAnonymous);
        } else {
          resolve(false);
        }
      });
    });
  }

  logout() {
    return signOut(this.auth);
  }
}
