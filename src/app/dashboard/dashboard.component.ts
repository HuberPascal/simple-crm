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
  topThreeCities: string[] = [];
  cityCounts: number[] = [];
  allProducts: string[] = [];
  topThreeProducts: string[] = [];
  productsCounts: number[] = [];

  constructor(private authService: AuthService, public db: Firestore) {}

  ngOnInit(): void {
    // this.createChartProducts();
    this.authService.getUserName(); // displayName-Wert aktualisieren
    this.displayName = this.authService.displayName;
    this.getNumberOfUsers();
    this.calculateTotalOfAllOrders();
    this.extractCitiesFromUserData();
    this.extractProductsFromUserData();
  }

  createChartResidence() {
    console.log('hat es bereits einen wert?', this.topThreeCities);
    this.chartResidence = new Chart('MyChartResidence', {
      type: 'bar', // Typ des horizontalen Balkendiagramms

      data: {
        labels: [
          this.topThreeCities[0],
          this.topThreeCities[1],
          this.topThreeCities[2],
        ],
        datasets: [
          {
            label: 'Cities',
            data: [this.cityCounts[0], this.cityCounts[1], this.cityCounts[2]],
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
      type: 'doughnut',

      data: {
        labels: [
          this.topThreeProducts[0],
          this.topThreeProducts[1],
          this.topThreeProducts[2],
        ],
        datasets: [
          {
            label: 'My First Dataset',
            data: [
              this.productsCounts[0],
              this.productsCounts[1],
              this.productsCounts[2],
            ],
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

  async getUserFirebaseData() {
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    if (isAnonymous) {
      return (firebaseData = collection(this.db, 'guest_users'));
    } else {
      return (firebaseData = collection(this.db, 'users'));
    }
  }

  async getOrderFirebaseData() {
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    if (isAnonymous) {
      return (firebaseData = collection(this.db, 'guest_orders'));
    } else {
      return (firebaseData = collection(this.db, 'orders'));
    }
  }

  async getNumberOfUsers() {
    const firebaseData = await this.getUserFirebaseData();
    const querySnapshot = await getDocs(firebaseData);
    this.numberOfUsers = querySnapshot.size;
  }

  async calculateTotalOfAllOrders() {
    const firebaseData = await this.getOrderFirebaseData();

    try {
      const querySnapshot = await getDocs(firebaseData);
      querySnapshot.forEach(async (doc) => {
        const orderData = doc.data();
        const orderTotal = await this.calculateOrderTotal(orderData);
        this.totalAmount += orderTotal;
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Bestellungen:', error);
    }
  }

  async calculateOrderTotal(orderData: any) {
    const amount = orderData['amount'];
    const price = orderData['price'];
    return amount * price;
  }

  async extractCitiesFromUserData() {
    const firebaseData = await this.getUserFirebaseData();

    try {
      const querySnapshot = await getDocs(firebaseData);
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        this.allCities.push(orderData['city']);
      });
    } catch (error) {}

    this.cityCount();
  }

  cityCount() {
    // Häufigkeit jeder Stadt zählen
    const cityCount = this.cityCounter(this.allCities);

    // Sortiert die Städte basierend auf ihrer Häufigkeit
    const sortedCities = this.sortCitiesByCount(cityCount);

    // Die drei häufigsten Städte auswählen
    this.topThreeCities = sortedCities.slice(0, 3);

    // Durchlaufe die topThreeCities und speichere die Anzahl der Vorkommen jeder Stadt in cityCounts
    this.topThreeCities.forEach((city) => {
      const count = cityCount[city];
      this.cityCounts.push(count);
    });
    this.createChartResidence();
  }

  // Funktion zum Zählen der Vorkommen von Elementen in einem Array
  cityCounter(array: any) {
    return array.reduce((accumulator: any, element: any) => {
      accumulator[element] = (accumulator[element] || 0) + 1;
      return accumulator;
    }, {});
  }

  extractCityCounts(cityCount: any) {
    const cityCounts: number[] = [];

    this.topThreeCities.forEach((city) => {
      const count = cityCount[city];
      cityCounts.push(count);
    });

    return cityCounts;
  }

  sortCitiesByCount(cityCount: { [key: string]: number }) {
    return Object.keys(cityCount).sort((a, b) => cityCount[b] - cityCount[a]);
  }

  async extractProductsFromUserData() {
    const firebaseData = await this.getOrderFirebaseData();

    try {
      const querySnapshot = await getDocs(firebaseData);
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        this.allProducts.push(orderData['product']);
      });
      console.log('produkte aus allProducts sind', this.allProducts);
    } catch (error) {}
    this.productCount();
  }

  productCount() {
    const productCount = this.productCounter(this.allProducts);
    const sortedCities = this.sortCitiesByCount(productCount);

    this.topThreeProducts = sortedCities.slice(0, 3);

    this.topThreeProducts.forEach((product) => {
      const count = productCount[product];
      this.productsCounts.push(count);
    });
    this.createChartProducts();
  }

  productCounter(array: any) {
    return array.reduce((accumulator: any, element: any) => {
      accumulator[element] = (accumulator[element] || 0) + 1;
      return accumulator;
    }, {});
  }
}
