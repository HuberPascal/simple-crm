import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../services/firebase-auth.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  firestore: Firestore = inject(Firestore);
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  isDrawerOpened: boolean = false;
  loggedIn: boolean = false;
  isUserLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.isUserLoggedIn = await this.authService.checkAuthLoggedInAsUser();
    this.loggedIn = await this.authService.checkAuth();
    this.isDrawerOpened = !this.isDrawerOpened;
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.isUserLoggedIn = false;
        this.loggedIn = false;
        this.isDrawerOpened = false;
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error('Fehler beim Ausloggen', error);
      });
  }

  toggleDrawer() {
    if (this.drawer) {
      this.isDrawerOpened = !this.isDrawerOpened;
      this.drawer.toggle();
    }
  }
}
