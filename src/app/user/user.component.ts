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
}
