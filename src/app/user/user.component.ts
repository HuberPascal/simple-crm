import { Component, OnInit, booleanAttribute } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from '../../models/user.class';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { UserService } from '../user.service';
import { AuthService } from '../services/firebase-auth.service';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user = new User();
  allUsers: any[] = []; // Ihre vollständigen Benutzerdaten
  filteredUsers: any[] = []; // Gefilterte Benutzerdaten
  selectedFilter: string = 'First Name'; // Standardmäßig nach 'First Name' filtern
  isUserLoggedIn: boolean = false;
  filteredUsersInputField: any[] = []; // Gefilterte Benutzerdaten vom Suchfeld
  filterInputValue: any; // Eingabe vom Suchfeld
  filterNotFound: boolean = false;

  constructor(
    public db: Firestore,
    public dialog: MatDialog,
    private authService: AuthService,
    public sidenav: SidenavComponent
  ) {
    this.filteredUsers = this.allUsers;
  }

  async ngOnInit(): Promise<void> {
    this.isUserLoggedIn = await this.authService.checkAuthLoggedInAsUser();
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();

    if (isAnonymous) {
      // Der Benutzer ist anonym (Gast)
      await this.getUserData('guest_users'); // Methode, um Musterdaten für Gastbenutzer abzurufen
      console.log('Der Benutzer ist anonym (Gast).');
    } else {
      // Der Benutzer ist nicht anonym (registriert)
      await this.getUserData('users');
      console.log('Der Benutzer ist nicht anonym (registriert).');
    }
  }

  async getUserData(user: string) {
    try {
      const usersCollectionRef = collection(this.db, user);
      onSnapshot(usersCollectionRef, (snapshot) => {
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

        // filterUsers() aufrufen, nachdem die Daten geladen wurden
        this.filterUsers();
      });
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Daten:', error);
    }
  }

  openDialog() {
    this.dialog.open(DialogAddUserComponent);
  }

  // User Filtern
  filterUsers() {
    switch (this.selectedFilter) {
      case 'First Name':
        this.filteredUsers = this.allUsers.sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );
        break;
      case 'Last Name':
        this.filteredUsers = this.allUsers.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );
        break;
      case 'City':
        this.filteredUsers = this.allUsers.sort((a, b) =>
          a.city.localeCompare(b.city)
        );
        break;
      default:
        this.filteredUsers = this.allUsers;
        break;
    }
  }

  /**
   * Filters the products based on the selected filter.
   */
  filterUserFromInput(): void {
    console.log('filter User geht');
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
}
