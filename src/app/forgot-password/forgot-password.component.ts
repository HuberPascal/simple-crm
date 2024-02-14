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
  isEmailValid: boolean | undefined = false;
  sendMail: boolean | undefined = false;
  fadeOutBtn: boolean | undefined = false;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  resetPassword(email: string) {
    this.loading = true;
    this.authService
      .resetPassword(email)
      .then(() => {
        // Erfolgsmeldung anzeigen
        this.emailFormInputField = this.email;
        this.email = '';
        this.sendMail = true;
        console.log(this.emailFormInputField);
        console.log('Email um das Passwort zurück zu setzen wurde verand');

        setTimeout(() => {
          // this.sendMail = true;
          this.fadeOutBtn = true;
        }, 3000);

        setTimeout(() => {
          // this.sendMail = false;
          this.fadeOutBtn = false;
        }, 1000);
        this.router.navigate(['/sign-in']);
      })
      .catch((error) => {
        // Fehlerbehandlung
        this.loading = false;
        this.isEmailValid = true;
        console.error('Fehler beim Zurücksetzen des Passworts', error);
        console.log(
          'Das Mail "Passwort zurücksetzen" kann nicht versendet werden'
        );
      });
  }
}
