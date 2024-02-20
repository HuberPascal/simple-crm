import { Component } from '@angular/core';
import { AuthService } from '../services/firebase-auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Checks whether the email address is valid according to a specific pattern.
   */
  validateMail() {
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.email);
    this.isEmailValid = emailPattern;

    if (this.isEmailValid) {
      this.ismail = true;
    } else {
      this.ismail = false;
    }
  }

  /**
   * Checks whether the password is valid according to a specific pattern.
   */
  validatePassword() {
    const minLength = 8; // Mindestlänge von 8 Zeichen
    const hasNumber = /\d/.test(this.password); // Enthält mindestens eine Zahl
    const hasUppercase = /[A-Z]/.test(this.password); // Enthält mindestens einen Großbuchstaben
    const hasLowercase = /[a-z]/.test(this.password); // Enthält mindestens einen Kleinbuchstaben

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

  /**
   * Handles form submission by checking if the email is already registered.
   * If the email is not registered, registers the user with the provided credentials.
   * @param {string} email - The email address provided in the form.
   * @param {string} password - The password provided in the form.
   * @param {string} name - The name provided in the form.
   */
  onSubmit(email: string, password: string, name: string) {
    this.loading = true;

    this.checkIfEmailExists(email, password, name);
  }

  /**
   * Checks whether the email has already been registered. If the email address does not exist, the user will be redirected to the registration process.
   * @param {string} email - The email address to be checked.
   * @param {string} password - The user's password.
   * @param {string} name - The user's name.
   * @returns {Promise<void>} - This function returns nothing (void), but waits for the asynchronous operation to complete.
   */
  async checkIfEmailExists(
    email: string,
    password: string,
    name: string
  ): Promise<void> {
    try {
      const signInMethods = await this.authService.checkEmailExistence(email);

      if (signInMethods.length > 0) {
        this.isEmailExists = true;
      } else {
        this.registerUser(email, password, name);
        this.isEmailExists = false;
      }
    } catch (error) {
      console.error('Fehler beim Überprüfen der E-Mail:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Saves and registers the user.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password chosen by the user.
   * @param {string} name - The name of the user.
   * @returns {Promise<void>}
   */
  async registerUser(
    email: string,
    password: string,
    name: string
  ): Promise<void> {
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

  /**
   * Handles successful user registration by updating relevant properties and navigating to the dashboard.
   * @param {string} email
   * @param {string} password
   */
  handleSuccessfulRegistration(email: string, password: string) {
    this.isUserRegister = true;
    this.userEmail = email;
    this.userPassword = password;
    this.router.navigate(['/dashboard']);
  }
}
