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
          this.fadeOutBtn = true;

          setTimeout(() => {
            this.sendMail = false;
            this.fadeOutBtn = false;
            this.router.navigate(['/sign-in']); // Ersetzen Sie '/home' durch den Pfad Ihrer Wahl
          }, 500);
        }, 3000);
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
