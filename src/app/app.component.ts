import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from './services/firebase-auth.service';
import { Router } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'simple-crm';
  firestore: Firestore = inject(Firestore);
  isDrawerOpened: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.isDrawerOpened = false;
        console.log('Erfolgreich ausgeloggt');
        this.router.navigate(['/sign-in']); // Ersetzen Sie '/home' durch den Pfad Ihrer Wahl
        // Behandeln des erfolgreichen Logouts, z.B. den Benutzer umleiten
      })
      .catch((error) => {
        console.error('Fehler beim ausloggen', error);
        console.log('Ausloggen fehlgeschlagen');
        // Fehlerbehandlung
      });
  }
}
