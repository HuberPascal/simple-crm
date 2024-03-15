import { Component, ViewChild, inject, HostListener } from '@angular/core';
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
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  firestore: Firestore = inject(Firestore);
  isDrawerOpened: boolean = false;
  loggedIn: boolean = false;
  isUserLoggedIn: boolean = false;
  currentUser!: any;
  user: any;
  isVisible: boolean = true;
  durationInSeconds = 5;
  mobileView: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.checkScreenSize();
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
    if (this.drawer) {
      this.drawer.close();
    }
    this.router.navigate(['/']);
    this.authService.openSnackBar('Successfully logged out!');
  }

  /**
   * Toggles the drawer (opens or closes it) if a drawer exists.
   */
  toggleDrawer() {
    if (this.drawer) {
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
   * Determines whether the specified segment should be activated based on the current URL.
   *
   * @param {string} segmentName - The name of the segment to check activation for.
   * @returns {boolean} - A boolean indicating whether the segment should be activated.
   */
  shouldActivate(segmentName: string): boolean {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/');

    if (segments[1] === 'guest' && segments[2] === segmentName) {
      return this.loggedInAsGuest(segments);
    } else if (segments[1] === segmentName && segments[2]?.length > 0) {
      return this.loggedInAsUser(segments);
    } else {
      this.isVisible = false;
      return false;
    }
  }

  /**
   * Handles visibility logic for a guest user.
   *
   * @param {string[]} segments - The segments of the current URL.
   * @returns {boolean} - A boolean indicating whether the segment should be visible.
   */
  loggedInAsGuest(segments: string[]): boolean {
    if (segments.length === 3) {
      this.isVisible = false;
      return true;
    } else {
      this.isVisible = true;
      return false;
    }
  }

  /**
   * Handles visibility logic for a logged-in user.
   *
   * @param {string[]} segments - The segments of the current URL.
   * @returns {boolean} - A boolean indicating whether the segment should be visible.
   */
  loggedInAsUser(segments: string[]): boolean {
    if (segments.length === 3) {
      this.isVisible = true;
      return false;
    } else {
      this.isVisible = false;
      return true;
    }
  }

  /**
   * Host listener function that listens for window resize events.
   * It triggers the checkScreenSize method when the window is resized.
   * @param {any} event - The window resize event object.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  /**
   * Checks the screen size and adjusts the drawer mode accordingly.
   * If the window width is less than 1000 pixels, sets the drawer mode to 'over',
   * otherwise sets it to 'side'.
   */
  checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.mobileView = window.innerWidth < 1000;
      if (this.drawer) {
        if (this.mobileView) {
          this.drawer.mode = 'over';
        } else {
          this.drawer.mode = 'side';
        }
      }
    }
  }

  /**
   * Closes the drawer if the application is viewed on a mobile device.
   */
  closeDrawerIfMobile() {
    if (typeof window !== 'undefined') {
      if (this.drawer) {
        if (this.mobileView) {
          this.drawer.close();
        }
      }
    }
  }

  /**
   * Checks if the drawer is opened and updates the corresponding state.
   */
  checkIsDrawerOpened() {
    if (!this.mobileView) {
      this.isDrawerOpened = true;
    } else {
      this.isDrawerOpened = false;
    }
  }
}
