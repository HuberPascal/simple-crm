import { Injectable, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import {
  GoogleAuthProvider,
  OAuthProvider,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  isLoggedIn: any;
  displayName: string = '';

  constructor(private auth: Auth) {}

  ngOnInit(): void {}

  async saveUserName(name: string): Promise<void> {
    const user_auth: any = this.auth.currentUser;

    if (user_auth) {
      try {
        await updateProfile(user_auth, { displayName: name });
        this.displayName = user_auth.displayName;
      } catch (error) {
        console.error('Fehler bei updateDoc', error);
      }
    } else {
      console.error('Benutzer ist nicht authentifiziert');
    }
  }

  async getUserName() {
    const user_auth: any = this.auth.currentUser;

    if (user_auth) {
      try {
        this.displayName = user_auth.displayName;
      } catch (error) {
        console.error('Fehler bei aktualisieren des displayName', error);
      }
    }
  }

  async register(email: string, password: string, name: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async checkMail(email: string) {
    return fetchSignInMethodsForEmail(this.auth, email);
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

  logout() {
    return signOut(this.auth);
  }

  /**
   * Checks the authentication state of the user.
   * @returns A promise that resolves to a boolean value indicating whether the user is authenticated or not.
   */
  checkAuthLoggedInAsUser() {
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

  checkAuth() {
    return new Promise<boolean>(async (resolve, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
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
}
