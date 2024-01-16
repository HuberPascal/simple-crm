// import { Injectable } from '@angular/core';
// import { FirestoreService } from './firestore.service';
// // import { DabubbleUser } from '../classes/user.class';

// @Injectable({
//   providedIn: 'root',
// })
// export class UserService {
//   // user = new DabubbleUser();

//   constructor(private firestoreService: FirestoreService) {}

//   /**
//    * Fetches user data for the specified userId by calling the FirestoreService's
//    * getLoggedInUserData method.
//    * Subscribes to the userDataObservable to receive and update the user information.
//    * @param userId - The unique identifier of the user.
//    */
//   async getUserData(userId: string) {
//     const userDataObservable = await this.firestoreService.getLogedInUserData(
//       userId
//     );
//     userDataObservable.subscribe((data) => {
//       this.user = new DabubbleUser(data);
//     });
//   }
// }
