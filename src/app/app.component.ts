import { Component, OnInit, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from './services/firebase-auth.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'simple-crm';
  firestore: Firestore = inject(Firestore);
  isDrawerOpened: boolean = false;
  loggedIn!: boolean;
  isUserLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    public auth: AuthService
  ) {}

  // async ngOnInit(): Promise<void> {
  //   this.authService.checkAuthLoggedInAsGuest().then(async (isAnonymous) => {
  //     // this.isAnonymous = isAnonymous;
  //     if (isAnonymous) {
  //       this.isGuest = true;
  //       console.log('Der Benutzer ist anonymmmmm (Gast).');
  //     } else {
  //       this.isGuest = false;
  //       // Der Benutzer ist nicht anonym (registriert)
  //       console.log('Der Benutzer ist nicht anonymmmm (registriert).');
  //     }
  //   });
  // }

  async ngOnInit(): Promise<void> {
    this.isUserLoggedIn = await this.authService.checkAuth();
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.isDrawerOpened = false;
        this.isUserLoggedIn = false;

        // if ((this.userService.isGuestUser = true)) {
        //   this.userService.isGuestUser = false;
        // }

        console.log('Erfolgreich ausgeloggt');
        this.router.navigate(['/sign-in']);
        // Behandeln des erfolgreichen Logouts, z.B. den Benutzer umleiten
      })
      .catch((error) => {
        console.error('Fehler beim ausloggen', error);
        console.log('Ausloggen fehlgeschlagen');
        // Fehlerbehandlung
      });
  }
}
