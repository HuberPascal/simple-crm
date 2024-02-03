import { Component } from '@angular/core';
import { AuthService } from '../services/firebase-auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  isUserLoggedIn: boolean = false;
  errorMessage: boolean = false;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appComponent: AppComponent,
    private userService: UserService
  ) {}

  login(email: string, password: string) {
    this.loading = true;
    this.authService
      .login(email, password)
      .then(() => {
        this.appComponent.isDrawerOpened = true;
        console.log('Login erfolgreich');
        this.appComponent.isUserLoggedIn = true;

        // Erfolgreich angemeldet, Benutzer weiterleiten
        this.router.navigate(['user/dashboard']);
      })
      .catch((error) => {
        // Fehlerbehandlung
        // this.isUserLoggedIn = true;
        this.loading = false;
        this.errorMessage = true;
        console.error('Login fehlgeschlagen', error);
        console.log('Login nicht erfolgreich');
      });
  }

  googleLogin() {
    this.loading = true;
    this.authService
      .googleLogin()
      .then(() => {
        this.appComponent.isDrawerOpened = true;
        // Erfolgreich eingeloggt, Benutzer weiterleiten
        console.log('Erfolgreich über Google eingeloggt');

        this.router.navigate(['user/dashboard']);
      })
      .catch((error) => {
        // Fehlerbehandlung
        this.loading = false;
        console.error('Google-Login fehlgeschlagen', error);
      });
  }

  guestLogin() {
    this.loading = true;
    this.authService
      .guestLogin()
      .then(() => {
        this.appComponent.isDrawerOpened = true;
        console.log('Gast Login erfolgreich');
        // this.userService.isGuestUser = true;

        // Erfolgreich als Gast angemeldet, Benutzer weiterleiten
        this.router.navigate(['guest/dashboard']);
      })
      .catch((error) => {
        // Fehlerbehandlung
        this.loading = false;
        console.error('Gast-Login fehlgeschlagen', error);
      });
  }
}
