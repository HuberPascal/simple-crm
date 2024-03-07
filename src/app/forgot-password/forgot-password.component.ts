import { Component } from '@angular/core';
import { AuthService } from '../services/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  email: string = '';
  emailFormInputField: string | undefined;
  isEmailExists: boolean | undefined = false;
  sendMail: boolean | undefined = false;
  fadeOutBtn: boolean | undefined = false;
  loading: boolean = false;
  registerError: boolean = false;
  isEmailValid: boolean = true;
  ismail: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Handles form submission by checking if the email is already registered.
   * @param email - The email address to be checked.
   */
  async onSubmit(email: string) {
    this.loading = true;

    this.checkIfEmailExists(email);
  }

  /**
   * Checks whether the email has already been registered. If the email address does not exist, an error message will be displayed.
   * @param email - The email address to be checked.
   */
  async checkIfEmailExists(email: string): Promise<void> {
    try {
      const signInMethods = await this.authService.checkEmailExistence(email);

      if (signInMethods.length > 0) {
        this.resetPassword(email);
      } else {
        this.isEmailExists = true;
      }
    } catch (error) {
      console.error('Fehler beim Überprüfen der E-Mail:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Sends an email to the email address to reset the password
   * @param email
   */
  async resetPassword(email: string) {
    try {
      await this.authService.resetPassword(email);

      this.handleSuccessfulResetPassword();
      this.authService.openSnackBar('The email has been sent');
    } catch (error) {
      console.error('Fehler beim Zurücksetzen des Passworts', error);
      this.loading = false;
      this.registerError = true;
    }
  }

  /**
   * Handles successful password reset request.
   */
  handleSuccessfulResetPassword() {
    this.emailFormInputField = this.email;
    this.email = '';
    this.sendMail = true;
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }

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
    this.isEmailExists = false;
  }
}
