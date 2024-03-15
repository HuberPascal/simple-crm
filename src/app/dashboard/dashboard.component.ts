import { Component, OnInit, HostListener } from '@angular/core';
import Chart from 'chart.js/auto';
import { AuthService } from '../services/firebase-auth.service';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs } from 'firebase/firestore';

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
  getNumberOfProduct: number = 0;
  totalAmount: number = 0;
  city: string = '';
  allCities: string[] = [];
  topThreeCities: string[] = [];
  cityCounts: number[] = [];
  allProducts: string[] = [];
  topThreeProducts: string[] = [];
  productsCounts: number[] = [];
  productWithLowestCount: string = '';

  constructor(private authService: AuthService, public db: Firestore) {}

  async ngOnInit(): Promise<void> {
    await this.getUserByName();
    this.getNumberOfUsers();
    this.getNumberOfProducts();
    this.calculateTotalOfAllOrders();
    this.extractCitiesFromUserData();
    this.extractProductsFromUserData();
  }

  /**
   * Retrieves the user's display name.
   */
  async getUserByName() {
    await this.authService.getUserName(); // displayName-Wert aktualisieren
    this.displayName = this.authService.displayName;
  }

  /**
   * Retrieves user data from Firestore.
   */
  async getUserFirebaseData() {
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    if (isAnonymous) {
      return (firebaseData = collection(this.db, 'guest_users'));
    } else {
      return (firebaseData = collection(this.db, 'users'));
    }
  }

  /**
   * Retrieves product data from Firestore.
   */
  async getProductFirebaseData() {
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    if (isAnonymous) {
      return (firebaseData = collection(this.db, 'guest_products'));
    } else {
      return (firebaseData = collection(this.db, 'products'));
    }
  }

  /**
   * Retrieves order data from Firestore.
   */
  async getOrderFirebaseData() {
    const isAnonymous = await this.authService.checkAuthLoggedInAsGuest();
    let firebaseData;

    if (isAnonymous) {
      return (firebaseData = collection(this.db, 'guest_orders'));
    } else {
      return (firebaseData = collection(this.db, 'orders'));
    }
  }

  /**
   * Retrieves the number of users from Firestore and updates the count.
   */
  async getNumberOfUsers() {
    const firebaseData = await this.getUserFirebaseData();
    const querySnapshot = await getDocs(firebaseData);
    this.numberOfUsers = querySnapshot.size;
  }

  /**
   * Retrieves the number of products from Firestore and updates the count.
   */
  async getNumberOfProducts() {
    const firebaseData = await this.getProductFirebaseData();
    const querySnapshot = await getDocs(firebaseData);
    this.getNumberOfProduct = querySnapshot.size;
  }

  /**
   * Calculates the total amount of all orders and updates the total amount.
   */
  async calculateTotalOfAllOrders() {
    const firebaseData = await this.getOrderFirebaseData();

    try {
      const querySnapshot = await getDocs(firebaseData);
      querySnapshot.forEach(async (doc) => {
        const orderData = doc.data();
        const orderTotal = await this.calculateOrderTotal(orderData);
        this.totalAmount += orderTotal;
        this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Produkte:', error);
    }
  }

  /**
   * Calculates the total amount of an order.
   * @param {Object} orderData - Order data.
   */
  async calculateOrderTotal(orderData: any) {
    const amount = orderData['amount'];
    const price = orderData['price'];
    return amount * price;
  }

  /**
   * Extracts cities from user data and updates city counts and charts.
   */
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

  /**
   * Counts the occurrences of each city and updates city counts and charts.
   */
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
    this.checkScreenSize750px();
  }

  /**
   * Counts the occurrences of each city in an array.
   * @param {string[]} array - Array of cities.
   */
  cityCounter(array: any) {
    return array.reduce((accumulator: any, element: any) => {
      accumulator[element] = (accumulator[element] || 0) + 1;
      return accumulator;
    }, {});
  }

  /**
   * Extracts counts of the top three cities from the city count object.
   * @param {Object.<string, number>} cityCount - Object containing city counts.
   */
  extractCityCounts(cityCount: any) {
    const cityCounts: number[] = [];

    this.topThreeCities.forEach((city) => {
      const count = cityCount[city];
      cityCounts.push(count);
    });

    return cityCounts;
  }

  /**
   * Sorts cities by count in descending order.
   * @param {Object} cityCount - Object containing city counts.
   */
  sortCitiesByCount(cityCount: { [key: string]: number }) {
    return Object.keys(cityCount).sort((a, b) => cityCount[b] - cityCount[a]);
  }

  /**
   * Extracts products from order data and updates product counts and charts.
   */
  async extractProductsFromUserData() {
    const firebaseData = await this.getOrderFirebaseData();

    try {
      const querySnapshot = await getDocs(firebaseData);
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        this.allProducts.push(orderData['product']);
      });
    } catch (error) {}
    this.productCount();
  }

  /**
   * Calculates the count of each product, updates the product with the lowest count,
   * updates the top three products, creates a chart, and checks the screen size.
   */
  productCount() {
    const productCount = this.calculateProductCount(this.allProducts);
    const sortedProducts = this.sortProductByCount(productCount);
    this.updateProductsWithLowestCount(sortedProducts);
    this.updateTopThreeProducts(sortedProducts, productCount);
    this.createChartProducts();
    this.checkScreenSize950px();
  }

  /**
   * Calculates the count of each product in the given array.
   * @param {string[]} products - The array of product names.
   */
  calculateProductCount(products: string[]): { [product: string]: number } {
    const productCount: { [product: string]: number } = {};
    products.forEach((product) => {
      if (productCount[product]) {
        productCount[product]++;
      } else {
        productCount[product] = 1;
      }
    });
    return productCount;
  }

  /**
   * Sorts products by count in descending order.
   * @param {Object.<string, number>} productCount - Object containing product counts.
   */
  sortProductByCount(productCount: { [key: string]: number }) {
    return Object.keys(productCount).sort(
      (a, b) => productCount[b] - productCount[a]
    );
  }

  /**
   * Updates the product with the lowest count based on the sorted product array.
   * @param {string[]} sortedProducts - The array of sorted product names.
   */
  updateProductsWithLowestCount(sortedProducts: string[]) {
    this.productWithLowestCount = sortedProducts[sortedProducts.length - 1];
    this.productWithLowestCount = this.capitalizeFirstLetter(
      this.productWithLowestCount
    );
  }

  /**
   * Updates the list of top three products and their counts based on the sorted product array.
   */
  updateTopThreeProducts(sortedProducts: string[], productCount: any) {
    this.topThreeProducts = sortedProducts.slice(0, 3);
    this.topThreeProducts.forEach((product) => {
      const count = productCount[product];
      this.productsCounts.push(count);
    });
  }

  /**
   * Capitalizes the first letter of the given word.
   * @param {string} word - The word to capitalize.
   * @returns {string} The word with the first letter capitalized.
   */
  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toLocaleUpperCase() + word.slice(1);
  }

  /**
   * Counts the occurrences of each product in an array.
   * @param {string[]} array - Array of products.
   */
  productCounter(array: any) {
    return array.reduce((accumulator: any, element: any) => {
      accumulator[element] = (accumulator[element] || 0) + 1;
      return accumulator;
    }, {});
  }

  /**
   * Formats a number with apostrophes for every three digits.
   * @param {number} number - Number to format.
   * @returns {string} Formatted number.
   */
  formatNumberWithApostrophe(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }

  /**
   * Host listener function that listens for window resize events.
   * It triggers the checkScreenSize method when the window is resized.
   * @param {any} event - The window resize event object.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // this.checkScreenSize750px();
    // this.checkScreenSize950px();
  }

  /**
   * Adjusts chart responsiveness based on screen size.
   */
  checkScreenSize750px() {
    if (typeof window !== 'undefined') {
      let mobileView = window.innerWidth < 750;

      if (mobileView) {
        this.chartResidence.config.options.responsive = true;
        this.chartResidence.config.options.maintainAspectRatio = false;
      } else {
        this.chartResidence.config.options.responsive = false;
        this.chartResidence.config.options.maintainAspectRatio = true;
      }

      if (this.chartResidence) {
        if (!mobileView && this.chartResidence.data) {
          this.chartResidence.destroy();
          this.createChartResidence();
        }
      }
    }
  }

  /**
   * Adjusts chart responsiveness based on screen size.
   */
  checkScreenSize950px() {
    if (typeof window !== 'undefined') {
      let mobileView = window.innerWidth < 950;

      if (mobileView) {
        this.chartProducts.config.options.responsive = true;
        this.chartProducts.config.options.maintainAspectRatio = false;
      } else {
        this.chartProducts.config.options.responsive = false;
        this.chartProducts.config.options.maintainAspectRatio = true;
      }

      if (this.chartProducts) {
        if (!mobileView && this.chartProducts.data) {
          this.chartProducts.destroy();
          this.createChartProducts();
        }
      }
    }
  }

  /**
   * Creates the residence chart using Chart.js.
   */
  createChartResidence() {
    this.chartResidence = new Chart('MyChartResidence', {
      type: 'bar', // Type of horizontal bar chart

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
              'rgba(255, 99, 132, 0.4)',
              'rgba(255, 159, 64, 0.4)',
              'rgba(255, 205, 86, 0.4)',
            ],
            borderColor: [
              'rgb(255, 99, 132, 1.0)',
              'rgb(255, 159, 64, 1.0)',
              'rgb(255, 205, 86, 1.0)',
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
            ticks: {
              color: '#fff',
            },
          },
          y: {
            ticks: {
              color: '#fff',
            },
          },
        },
        aspectRatio: 4, // Adjust height
        plugins: {
          legend: {
            labels: {
              color: '#fff',
            },
          },
        },
      },
    });
  }

  /**
   * Creates the products chart using Chart.js.
   */
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
            label: 'Products',
            data: [
              this.productsCounts[0],
              this.productsCounts[1],
              this.productsCounts[2],
            ],
            backgroundColor: [
              'rgba(54, 162, 235, 0.4)',
              'rgba(255, 206, 86, 0.4)',
              'rgba(75, 192, 192, 0.4)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 4, // Adjust height
        plugins: {
          legend: {
            labels: {
              color: '#fff',
            },
          },
        },
      },
    });
  }
}
