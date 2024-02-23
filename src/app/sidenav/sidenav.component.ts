import { Component, ViewChild, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../services/firebase-auth.service';
import { MatDrawer } from '@angular/material/sidenav';
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

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.isUserLoggedIn = await this.authService.checkAuthLoggedInAsUser();
    this.loggedIn = await this.authService.checkAuth();
  }

  /**
   * Handle user logout
   */
  async logout() {
    try {
      await this.authService.logout();

      this.handleSuccessfulLogout();
    } catch (error) {
      console.error('Fehler beim Ausloggen', error);
    }
  }

  /**
   * Handles successful user logout by updating relevant properties and navigating to sign-in.
   */
  handleSuccessfulLogout() {
    this.isUserLoggedIn = false;
    this.loggedIn = false;
    this.isDrawerOpened = false;
    this.router.navigate(['/']);
  }

  /**
   * Toggles the drawer (opens or closes it) if a drawer exists.
   */
  toggleDrawer() {
    if (this.drawer) {
      this.isDrawerOpened = !this.isDrawerOpened;
      this.drawer.toggle();
    }
  }

  /**
   * Checks if the current route is one of the entry routes.
   * @returns {boolean} True if the current route is one of the entry routes, otherwise false.
   */
  checkIfEntryRoutes(): boolean {
    const currentRoute = this.router.url;
    return (
      currentRoute.includes('/sign-in') || currentRoute.includes('/register'),
      currentRoute.includes('/forgot-password')
    );
  }

  /**
   *  Retrieves user data for the sidenav based on the current user.
   * @param currentUser
   */
  getUserDataToSidenav(currentUser: string) {
    this.user = new User(currentUser);
  }

  /**
   * Determines whether to activate the specified route segment based on the current URL.
   * If the route segment matches the first segment of the URL, it activates the segment.
   * If an ID follows the route segment, it deactivates the segment.
   * @param {string} first - The route segment to check for activation.
   * @returns {boolean} True if the route segment should be activated, otherwise false.
   */
  shouldActivate(segmentName: string): boolean {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/');
    if (
      (segments[1] === 'guest' && segments[2] === segmentName) ||
      segments[1] === segmentName
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
