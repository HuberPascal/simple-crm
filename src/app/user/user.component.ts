import { Component, OnInit, booleanAttribute } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from '../../models/user.class';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { SignInComponent } from '../sign-in/sign-in.component';
import { UserService } from '../user.service';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../services/firebase-auth.service';

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

  // isAnonymous: boolean | undefined;

  constructor(
    public db: Firestore,
    public dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.filteredUsers = this.allUsers;
  }

  async ngOnInit(): Promise<void> {
    this.isUserLoggedIn = await this.authService.checkAuth();
    this.authService.checkAuthLoggedInAsGuest().then(async (isAnonymous) => {
      // this.isAnonymous = isAnonymous;
      if (isAnonymous) {
        // Der Benutzer ist anonym (Gast)
        await this.getGuestUserData(); // Methode, um Musterdaten für Gastbenutzer abzurufen
        console.log('Der Benutzer ist anonym (Gast).');
      } else {
        // Der Benutzer ist nicht anonym (registriert)
        await this.getRegisterUserData();
        console.log('Der Benutzer ist nicht anonym (registriert).');
      }
    });

    // if (this.userService.isGuestUser) {
    //   await this.getGuestUserData(); // Methode, um Musterdaten für Gastbenutzer abzurufen
    //   console.log('guets ist', this.userService.isGuestUser);
    // } else {
    //   // Normale Anmeldung für registrierte Benutzer

    // }
  }

  async getRegisterUserData() {
    try {
      const usersCollectionRef = collection(this.db, 'users');
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
        console.log('Aktuelle Benutzerdaten:', this.allUsers);

        // filterUsers() aufrufen, nachdem die Daten geladen wurden
        this.filterUsers();
      });
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Daten:', error);
    }
  }

  async getGuestUserData() {
    try {
      const usersCollectionRef = collection(this.db, 'guest_users');
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
        console.log('Aktuelle Benutzerdaten vom Gast :', this.allUsers);

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
