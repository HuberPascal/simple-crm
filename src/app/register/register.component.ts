import { Component } from '@angular/core';
import { AuthService } from '../services/firebase-auth.service';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthenticationDatabaseService } from '../services/authentication-database.service';

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
  isEmailExists: boolean = false;
  ispassword: boolean = false;
  ismail: boolean = false;
  registerError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public db: Firestore,
    private authDatabase: AuthenticationDatabaseService
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

  onSubmit(email: string, password: string, name: string) {
    this.loading = true;

    this.checkIfEmailExists(email, password, name);
  }

  async checkIfEmailExists(email: string, password: string, name: string) {
    try {
      await this.authService.login(email, password);
      console.error('Die Email Adresse ist bereits vorhanden');
      this.isEmailExists = true;
      this.loading = false;
    } catch {
      this.registerUser(email, password, name);
    }
  }

  async registerUser(email: string, password: string, name: string) {
    try {
      await this.authService.register(email, password, name);
      await this.authService.saveUserName(name);
      this.handleSuccessfulRegistration(email, password);
    } catch (error) {
      console.error('Fehler beim Registrieren', error);
      this.registerError = true;
      this.loading = false;
    }
  }

  handleSuccessfulRegistration(email: string, password: string) {
    this.isUserRegister = true;
    this.userEmail = email;
    this.userPassword = password;
    this.router.navigate(['/dashboard']);
  }
}
