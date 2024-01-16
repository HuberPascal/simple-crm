import { Component } from '@angular/core';
import { AuthService } from '../services/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  isUserRegister: boolean = false;
  userEmail: string | undefined;
  userPassword: string | undefined;
  loading: boolean = false;
  isEmailValid: boolean | undefined = false;

  constructor(private authService: AuthService, private router: Router) {}

  register(email: string, password: string) {
    this.loading = true;
    this.authService
      .register(email, password)
      .then(() => {
        // Erfolgreich registriert
        this.isUserRegister = true;
        this.userEmail = this.email;
        this.userPassword = this.password;
        console.log('Erfolgreich registriert');
        this.router.navigate(['/dashboard']); // Ersetzen Sie '/home' durch den Pfad Ihrer Wahl
      })
      .catch((error) => {
        // Fehlerbehandlung
        this.isEmailValid = true;
        this.loading = false;
        console.error('Fehler beim registrieren', error);
        console.log('Fehler beim registrieren');
      });
  }
}
