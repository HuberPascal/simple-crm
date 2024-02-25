import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogAddUserComponent } from './dialog-add-user/dialog-add-user.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environments';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { MatMenuModule } from '@angular/material/menu';
import { DialogEditAddressComponent } from './dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from './dialog-edit-user/dialog-edit-user.component';
import { RegisterComponent } from './register/register.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DialogDeleteUserComponent } from './dialog-delete-user/dialog-delete-user.component';
import { DialogEditOrderComponent } from './dialog-edit-order/dialog-edit-order.component';
import { DialogDeleteOrderComponent } from './dialog-delete-order/dialog-delete-order.component';
import { DialogAddOrderComponent } from './dialog-add-order/dialog-add-order.component';
import { MatSelectModule } from '@angular/material/select';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { GuestDashboardComponent } from './guest-dashboard/guest-dashboard.component';
import { GuestUserComponent } from './guest-user/guest-user.component';
import { ProductsComponent } from './products/products.component';
import { DialogAddProductComponent } from './dialog-add-product/dialog-add-product.component';
import { DialogEditProductComponent } from './dialog-edit-product/dialog-edit-product.component';
import { DialogDeleteProductComponent } from './dialog-delete-product/dialog-delete-product.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HttpClientModule } from '@angular/common/http';
import { KanbanComponent } from './kanban/kanban.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserComponent,
    DialogAddUserComponent,
    UserDetailComponent,
    DialogEditAddressComponent,
    DialogEditUserComponent,
    RegisterComponent,
    SignInComponent,
    ForgotPasswordComponent,
    DialogDeleteUserComponent,
    DialogEditOrderComponent,
    DialogDeleteOrderComponent,
    DialogAddOrderComponent,
    ImprintComponent,
    PrivacyPolicyComponent,
    GuestDashboardComponent,
    GuestUserComponent,
    ProductsComponent,
    DialogAddProductComponent,
    DialogEditProductComponent,
    DialogDeleteProductComponent,
    SidenavComponent,
    KanbanComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatProgressBarModule,
    MatCardModule,
    MatMenuModule,
    MatSelectModule,
    HttpClientModule,
    // AngularFireModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),

    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'simple-crm-4cea6',
        appId: '1:703967658167:web:b83f9f36f777c0b968cd32',
        storageBucket: 'simple-crm-4cea6.appspot.com',
        apiKey: 'AIzaSyCd2NYU9qFPSncjd7mDCiRGqViama30y6w',
        authDomain: 'simple-crm-4cea6.firebaseapp.com',
        messagingSenderId: '703967658167',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    AngularFireAuthModule,
    // provideDatabase(() => getDatabase()),
  ],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
