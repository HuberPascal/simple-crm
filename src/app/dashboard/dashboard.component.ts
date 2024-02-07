import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AuthService } from '../services/firebase-auth.service';
import { UserComponent } from '../user/user.component';
import { Firestore, docSnapshots } from '@angular/fire/firestore';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { UserService } from '../user.service';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public chartResidence: any;
  public chartProducts: any;
  displayName: string = '';
  allUsers: any = '';
  numberOfUsers: number = 0;
  totalAmount: number = 0;
  city: string = '';
  allCities: string[] = [];

  constructor(private authService: AuthService, public db: Firestore) {}

  ngOnInit(): void {
    this.createChartResidence();
    this.createChartProducts();
    this.authService.getUserName(); // displayName-Wert aktualisieren
    this.displayName = this.authService.displayName;
    this.getNumberOfUsers();
    this.calculateTotalOfAllOrders();
    this.extractCitiesFromUserData();
    console.log('dashboard displayName ist', this.displayName);
  }

  createChartResidence() {
    this.chartResidence = new Chart('MyChartResidence', {
      type: 'bar', // Typ des horizontalen Balkendiagramms

      data: {
        labels: ['Berlin', 'Hannover', 'Zürich'],
        datasets: [
          {
            label: 'User',
            data: [65, 59, 34],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
          },
        },
        aspectRatio: 4, // Ändern Sie diesen Wert, um die Höhe anzupassen
      },
    });
  }

  createChartProducts() {
    this.chartProducts = new Chart('MyChartProducts', {
      type: 'doughnut', // Typ des horizontalen Balkendiagramms

      data: {
        labels: ['Apple iPhone', 'LG TV', 'MacBook Pro'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 4, // Ändern Sie diesen Wert, um die Höhe anzupassen
      },
    });
  }

  // async getNumberOfUsers() {

  async getNumberOfUsers() {
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    if (isAnonymous) {
      firebaseData = collection(this.db, 'guest_users');
    } else {
      firebaseData = collection(this.db, 'users');
    }

    const querySnapshot = await getDocs(firebaseData);
    this.numberOfUsers = querySnapshot.size;
    console.log(
      'Anzahl der Dokumente in der Sammlung "users":',
      this.numberOfUsers
    );
  }

  async calculateTotalOfAllOrders() {
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    if (isAnonymous) {
      firebaseData = collection(this.db, 'guest_orders');
    } else {
      firebaseData = collection(this.db, 'orders');
    }

    try {
      const querySnapshot = await getDocs(firebaseData);
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        const amount = orderData['amount']; // assuming 'amount' is the field containing the order amount
        const price = orderData['price']; // assuming 'amount' is the field containing the order amount
        const orderTotal = amount * price;
        this.totalAmount += orderTotal;
      });
      console.log('Gesamtbetrag aller Bestellungen:', this.totalAmount);
    } catch (error) {
      console.error('Fehler beim Abrufen der Bestellungen:', error);
    }
  }

  async extractCitiesFromUserData() {
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    if (isAnonymous) {
      firebaseData = collection(this.db, 'guest_users');
    } else {
      firebaseData = collection(this.db, 'users');
    }

    try {
      const querySnapshot = await getDocs(firebaseData);
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        // this.city = orderData['city'];
        this.allCities.push(orderData['city']);

        // hier muss das Array noch gefiltert werden
      });
      console.log('Alle cities:', this.allCities);
    } catch (error) {
      console.error('Fehler beim Abrufen der Städte:', error);
    }
  }
}
