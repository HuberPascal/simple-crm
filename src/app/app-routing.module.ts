import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { RegisterComponent } from './register/register.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { authGuard } from './services/auth.guard';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProductsComponent } from './products/products.component';
import { KanbanComponent } from './kanban/kanban.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'guest/dashboard',
    component: DashboardComponent,
  },
  { path: 'user', component: UserComponent, canActivate: [authGuard] },
  {
    path: 'guest/user',
    component: UserComponent,
  },
  {
    path: 'user/:id',
    component: UserDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'guest/user/:id',
    component: UserDetailComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'guest/products',
    component: ProductsComponent,
  },
  {
    path: 'kanban',
    component: KanbanComponent,
    canActivate: [authGuard],
  },
  {
    path: 'guest/kanban',
    component: KanbanComponent,
  },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
