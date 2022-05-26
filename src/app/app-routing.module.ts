import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WatchListComponent } from './components/watches/watch-list/watch-list.component';
import { LoginComponent } from './components/auth/login/login.component';
import { CreateWatchComponent } from './components/watches/create-watch/create-watch.component';
import { AdminRouteGuard } from './route-guards/admin-route-guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { EditWatchComponent } from './components/watches/edit-watch/edit-watch.component';
import { AdminRegisterComponent } from './components/auth/admin-register/admin-register.component';
import { OrderListComponent } from './components/order-list/order-list.component';

const routes: Routes = [
  { path: '', component: WatchListComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: 'watches', component: WatchListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'adminRegister', component: AdminRegisterComponent, canActivate: [AdminRouteGuard]},
  { path: 'createWatch', component: CreateWatchComponent, canActivate: [AdminRouteGuard]},
  { path: 'editWatch', component: EditWatchComponent, canActivate: [AdminRouteGuard]},
  { path: 'orders', component: OrderListComponent, canActivate: [AdminRouteGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
