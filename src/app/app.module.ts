import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { ProductsComponent } from './products/products.component';
import { DialogAddProductComponent } from './dialog-add-product/dialog-add-product.component';
import { DialogEditProductComponent } from './dialog-edit-product/dialog-edit-product.component';
import { DialogDeleteProductComponent } from './dialog-delete-product/dialog-delete-product.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { KanbanComponent } from './kanban/kanban.component';
import { DialogAddTaskConmponent } from './dialog-add-task/dialog-add-task.component';
import { DialogEditTaskComponent } from './dialog-edit-task/dialog-edit-task.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { KanbanDragAndDropComponent } from './kanban-drag-and-drop/kanban-drag-and-drop.component';
import { DialogDeleteTaskComponent } from './dialog-delete-task/dialog-delete-task.component';
import { DialogSwapTaskComponent } from './dialog-swap-task/dialog-swap-task.component';

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
    ProductsComponent,
    DialogAddProductComponent,
    DialogEditProductComponent,
    DialogDeleteProductComponent,
    SidenavComponent,
    KanbanComponent,
    DialogAddTaskConmponent,
    DialogEditTaskComponent,
    KanbanDragAndDropComponent,
    DialogDeleteTaskComponent,
    DialogSwapTaskComponent,
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
    DragDropModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
