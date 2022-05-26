import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WatchListComponent } from './components/watches/watch-list/watch-list.component';
import { WsNavbarComponent } from './components/ws-navbar/ws-navbar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { WatchPreviewCardComponent } from './components/watches/watch-preview-card/watch-preview-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CreateWatchComponent } from './components/watches/create-watch/create-watch.component';
import { AdminRouteGuard } from './route-guards/admin-route-guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { EditWatchComponent } from './components/watches/edit-watch/edit-watch.component';
import { BuyModalComponent } from './modals/buy-modal/buy-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AdminRegisterComponent } from './components/auth/admin-register/admin-register.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    WsNavbarComponent,
    WatchListComponent,
    LoginComponent,
    WatchPreviewCardComponent,
    CreateWatchComponent,
    PageNotFoundComponent,
    EditWatchComponent,
    BuyModalComponent,
    ErrorModalComponent,
    AdminRegisterComponent,
    OrderListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [AdminRouteGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
