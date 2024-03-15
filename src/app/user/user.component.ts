import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from '../../models/user.class';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { AuthService } from '../services/firebase-auth.service';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user = new User();
  allUsers: any[] = []; // Vollständigen Benutzerdaten
  filteredUsers: any[] = []; // Gefilterte Benutzerdaten
  selectedFilter: string = 'First Name'; // Standardmäßig nach 'First Name' filtern
  isAnonymous: boolean = false;
  filteredUsersInputField: any[] = []; // Gefilterte Benutzerdaten vom Suchfeld
  filterInputValue: any; // Eingabe vom Suchfeld
  filterNotFound: boolean = false;
  mobileView: boolean = false;
  loading: boolean = false;

  constructor(
    public db: Firestore,
    public dialog: MatDialog,
    private authService: AuthService,
    public sidenav: SidenavComponent,
    public database: DatabaseService
  ) {
    this.filteredUsers = this.allUsers;
  }

  async ngOnInit(): Promise<void> {
    this.checkScreenSize();
    this.isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

    if (this.isAnonymous) {
      await this.getUserData('guest_users');
    } else {
      await this.getUserData('users');
    }
  }

  /**
   * Fetches user data from the specified collection in the Firestore database.
   *
   * @param {string} user - The name of the collection from which to fetch user data.
   */
  async getUserData(user: string) {
    this.loading = true;
    try {
      const usersCollectionRef = collection(this.db, user);
      this.getUserDataOnSnapshot(usersCollectionRef);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Daten:', error);
    }
  }

  /**
   * Listens for changes in the specified collection and updates the `allUsers` array accordingly.
   * Additionally, it triggers the `filterUsers()` method to filter the user data.
   *
   * @param {any} usersCollectionRef - The reference to the collection in Firestore.
   */
  getUserDataOnSnapshot(usersCollectionRef: any) {
    onSnapshot(
      usersCollectionRef,
      (snapshot: { docs: any[] }) => {
        this.allUsers = snapshot.docs.map((doc) => {
          const userData = doc.data();

          return {
            id: doc.id,
            firstName: userData['firstName'],
            lastName: userData['lastName'],
            email: userData['email'],
            city: userData['city'],
          };
        });
        this.filterUsers();
        this.loading = false;
      },
      (error) => {
        console.error('Fehler beim laden der User Daten:', error);
        this.loading = false;
      }
    );
  }

  /**
   * Opens the dialog for adding a new user.
   */
  openDialogAddUser() {
    this.dialog.open(DialogAddUserComponent);
  }

  /**
   * Filters the user based on the selected filter.
   */
  filterUsers() {
    switch (this.selectedFilter) {
      case 'First Name':
        this.filterByFirstName();
        break;
      case 'Last Name':
        this.filterByLastName();
        break;
      case 'City':
        this.filterByCity();
        break;
      default:
        this.filteredUsers = this.allUsers;
        break;
    }
  }

  /**
   * Filters the user by first name.
   * Sorts the users alphabetically based on the first name.
   */
  filterByFirstName() {
    this.filteredUsers = this.allUsers.sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );
  }

  /**
   * Filters the user by last name.
   * Sorts the users alphabetically based on the last name.
   */
  filterByLastName() {
    this.filteredUsers = this.allUsers.sort((a, b) =>
      a.lastName.localeCompare(b.lastName)
    );
  }

  /**
   * Filters the user by city.
   * Sorts the users alphabetically based on the city.
   */
  filterByCity() {
    this.filteredUsers = this.allUsers.sort((a, b) =>
      a.city.localeCompare(b.city)
    );
  }

  /**
   * Filters the products based on the selected filter.
   */
  filterUserFromInput(): void {
    if (this.selectedFilter === 'First Name') {
      this.filterFirstName();
    } else if (this.selectedFilter === 'Last Name') {
      this.filterLastName();
    } else if (this.selectedFilter === 'City') {
      this.filterCity();
    }
    this.checkFilterNotFound();
  }

  /**
   * Filters the products based on the product name and updates the array of filtered products.
   *
   * @returns {Array} An array of filtered products.
   */
  filterFirstName(): Array<any> {
    return (this.filteredUsersInputField = this.filteredUsers.filter((user) =>
      user.firstName
        .toLowerCase()
        .startsWith(this.filterInputValue.toLowerCase())
    ));
  }

  /**
   * Filters the products based on the price and updates the array of filtered products.
   *
   * @returns {Array} An array of filtered products.
   */
  filterLastName(): Array<any> {
    return (this.filteredUsersInputField = this.filteredUsers.filter((user) =>
      user.lastName.toString().startsWith(this.filterInputValue)
    ));
  }

  /**
   * Filters the products based on the product type and updates the array of filtered products.
   *
   * @returns {Array} An array of filtered products.
   */
  filterCity(): Array<any> {
    return (this.filteredUsersInputField = this.filteredUsers.filter((user) =>
      user.city.toLowerCase().includes(this.filterInputValue.toLowerCase())
    ));
  }

  /**
   * Checks if the filter input value is not empty and if the filtered products array is empty.
   *
   * @returns {void}
   */
  checkFilterNotFound(): void {
    if (
      this.filterInputValue !== '' &&
      this.filteredUsersInputField.length == 0
    ) {
      this.filterNotFound = true;
    } else {
      this.filterNotFound = false;
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
   * If the window width is less than 800 pixels, sets mobileView to true, else sets it to false.
   */
  checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.mobileView = window.innerWidth < 800;
      if (this.mobileView) {
        this.mobileView = true;
      } else {
        this.mobileView = false;
      }
    }
  }
}
