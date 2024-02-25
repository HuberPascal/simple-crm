import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../services/firebase-auth.service';
import { Router } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  durationInSeconds = 5;
  displayName: string = '';

  @ViewChild('drawer') drawer: MatDrawer | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private SidenavComponent: SidenavComponent,
    private _snackBar: MatSnackBar
  ) {}

  /**
   * Handles user login using the provided email and password.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   */
  async login(email: string, password: string) {
    this.loading = true;
    try {
      await this.authService.login(email, password);
      this.handleSuccessfulLogin();
    } catch (error) {
      console.error('Login fehlgeschlagen', error);
      this.loading = false;
      this.errorMessage = true;
    }
  }

  /**
   * Handles successful user login by updating relevant properties and navigating to the dashboard.
   */
  async handleSuccessfulLogin() {
    this.authService.getUserName();
    this.SidenavComponent.loggedIn = true;
    this.SidenavComponent.isDrawerOpened = true;
    this.SidenavComponent.isUserLoggedIn = true;
    await this.getUserByName();
    this.router.navigate(['dashboard']);
    this.authService.openSnackBarLogin('Logged in as', this.displayName);
  }

  /**
   * Initiates a Google login process for the user. If the login is successful,
   * the user is redirected to the dashboard page.
   */
  async googleLogin() {
    this.loading = true;
    try {
      await this.authService.googleLogin();
      this.SidenavComponent.isDrawerOpened = true;
      await this.getUserByName();
      this.router.navigate(['dashboard']);
      this.authService.openSnackBarLogin('Logged in as', this.displayName);
    } catch (error) {
      console.error('Google-Login fehlgeschlagen', error);
      this.loading = false;
    }
  }

  /**
   * Initiates a Guest login process for the user. If the login is successful,
   * the user is redirected to the dashboard page.
   */
  async guestLogin() {
    this.loading = true;
    try {
      await this.authService.guestLogin();
      this.SidenavComponent.loggedIn = true;
      this.SidenavComponent.isDrawerOpened = true;
      this.router.navigate(['guest/dashboard']);
      this.authService.openSnackBar('Logged in as Guest!');
    } catch (error) {
      this.loading = false;
      console.error('Gast-Login fehlgeschlagen', error);
    }
  }

  async getUserByName() {
    await this.authService.getUserName(); // displayName-Wert aktualisieren
    this.displayName = this.authService.displayName;
  }
}
