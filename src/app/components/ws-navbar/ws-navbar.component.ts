import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserLoggedIn } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ws-navbar',
  templateUrl: './ws-navbar.component.html',
  styleUrls: ['./ws-navbar.component.scss']
})
export class WsNavbarComponent implements OnInit {
  appUser: IUserLoggedIn | null = null;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) { 
  }

  async ngOnInit() {
    this.authService.refreshAuthenticatedUser();
    this.authService.getAuthenticatedUser().subscribe({
      next: (data: IUserLoggedIn | null) => {
          this.appUser = data;
          this.isAdmin = this.authService.isAdmin()
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
