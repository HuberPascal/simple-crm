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
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: any;
  displayName: string = '';
  durationInSeconds = 3;

  constructor(private auth: Auth, private _snackBar: MatSnackBar) {}

  /**
   * Saves the user name to the authenticated user's profile.
   * @param {string} name - The name to be saved.
   * @returns {Promise<void>} A promise that resolves when the name is successfully saved.
   */
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

  /**
   * Retrieves the user name from the authenticated user's profile.
   */
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

  /**
   * Registers a new user with the provided email, password, and name.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   */
  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Logs in a user with the provided email and password.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   */
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Checks if the provided email exists in the authentication system.
   * @param {string} email - The email to check.
   */
  async checkEmailExistence(email: string) {
    return fetchSignInMethodsForEmail(this.auth, email);
  }

  /**
   * Sends a password reset email to the provided email address.
   * @param {string} email - The email address to send the password reset email to.
   */
  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Logs in a user anonymously.
   */
  guestLogin() {
    return signInAnonymously(this.auth);
  }

  /**
   * Logs in a user with Google authentication provider.
   */
  googleLogin() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  /**
   * Logs out the currently authenticated user.
   */
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

  /**
   * Checks the authentication state of the user.
   */
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

  /**
   * Checks if the user is authenticated as a guest user.
   */
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

  /**
   * Opens the snack bar.
   */
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      panelClass: ['custom-snackbar'],
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  /**
   * Opens the snack bar.
   */
  openSnackBarLogin(message: string, displayName: string) {
    const snackBarRef = this._snackBar.open(
      `${message} ${displayName}`,
      'Close',
      {
        panelClass: ['custom-snackbar'],
        duration: this.durationInSeconds * 1000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );
  }
}
