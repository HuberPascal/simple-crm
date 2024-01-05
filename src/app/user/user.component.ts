import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from '../../models/user.class';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, onSnapshot } from 'firebase/firestore';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user = new User();
  allUsers: any[] = [];

  constructor(public db: Firestore, public dialog: MatDialog) {}

  ngOnInit(): void {
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
      });
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Daten:', error);
    }

    // Wenn die Daten aktualisiert werden in dem Eintrag: users
    // try {
    //   const usersCollectionRef = collection(this.db, 'users');
    //   onSnapshot(usersCollectionRef, (snapshot) => {
    //     snapshot.docs.forEach((doc) => {
    //       console.log(
    //         `Die ID von dem Snapshot ist: ${doc.id}, Data: `,
    //         doc.data()
    //       );
    //       console.log('allUsers ist', this.allUsers);
    //     });
    //   });
    // } catch (error) {
    //   console.error('Fehler beim Aktualisieren der Daten:', error);
    // }
  }

  openDialog() {
    this.dialog.open(DialogAddUserComponent);
  }
}
