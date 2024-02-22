import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from '../services/firebase-auth.service';
import { MatDrawer } from '@angular/material/sidenav';
import { user } from '@angular/fire/auth';
import { User } from '../../models/user.class';

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
  currentUser!: any;
  user: any;
  isVisible: boolean = true;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.isUserLoggedIn = await this.authService.checkAuthLoggedInAsUser();
    this.loggedIn = await this.authService.checkAuth();
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

  checkIfEntryRoutes() {
    const currentRoute = this.router.url;
    return (
      currentRoute.includes('/sign-in') || currentRoute.includes('/register'),
      currentRoute.includes('/forgot-password')
    );
  }

  getUserDataToSidenav(currentUser: string) {
    this.user = new User(currentUser);
  }

  shouldActivate(first: string): boolean {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/');
    if (
      (segments[1] === 'guest' && segments[2] === first) ||
      segments[1] === first
    ) {
      if (segments.length === 3 || segments[3].length === 0) {
        this.isVisible = false;
        return true; // 'active' Klasse zuweisen, wenn keine ID folgt
      } else {
        this.isVisible = true;
        return false; // 'active' Klasse nicht zuweisen, wenn eine ID folgt
      }
    } else {
      return false; // 'active' Klasse nicht zuweisen für andere Links
    }
  }
}
