import { Component } from '@angular/core';
import { AuthService } from '../services/firebase-auth.service';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  mail: string = '';
  isUserRegister: boolean = false;
  userEmail: string | undefined;
  userPassword: string | undefined;
  loading: boolean = false;
  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;
  isEmailExists: boolean = true;
  ispassword: boolean = false;
  ismail: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public db: Firestore,
    private auth: AuthService
  ) {}

  validateMail() {
    // E-Mail-Validierung
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.email);
    this.isEmailValid = emailPattern;

    if (this.isEmailValid) {
      this.ismail = true;
    } else {
      this.ismail = false;
    }
  }

  validatePassword() {
    // Passwortvalidierung
    const minLength = 8;
    const hasNumber = /\d/.test(this.password);
    const hasUppercase = /[A-Z]/.test(this.password);
    const hasLowercase = /[a-z]/.test(this.password);

    this.isPasswordValid =
      this.password.length >= minLength &&
      hasNumber &&
      hasUppercase &&
      hasLowercase;

    if (this.isPasswordValid) {
      this.ispassword = true;
    } else {
      this.ispassword = false;
    }
  }

  // register(email: string, password: string) {
  onSubmit(email: string, password: string, name: string) {
    this.loading = true;

    // Überprüfen, ob die E-Mail-Adresse bereits registriert ist
    this.authService
      .login(email, password)
      .then(() => {
        // Die Anmeldung war erfolgreich, was bedeutet, dass die E-Mail-Adresse bereits existiert
        this.isEmailExists = false; // isEmailValid auf false setzen, um anzuzeigen, dass die E-Mail-Adresse bereits existiert
        this.loading = false;
      })
      .catch((error) => {
        // Fehlerbehandlung
        if (error) {
          this.authService
            .register(email, password, name)
            .then(() => {
              // Erfolgreich registriert
              this.authService.saveUserName(name);
              this.isUserRegister = true;
              this.userEmail = this.email;
              this.userPassword = this.password;
              console.log('Erfolgreich registriert');
              this.router.navigate(['/dashboard']);
            })
            .catch((registrationError) => {
              // Fehlerbehandlung bei der Registrierung
              this.loading = false;
              this.isEmailExists = false;
              console.error('Fehler beim registrieren', registrationError);
            });
        } else {
          // Ein anderer Fehler ist aufgetreten
          this.loading = false;
          console.error('Fehler beim Anmelden', error);
        }
      });
  }
}
