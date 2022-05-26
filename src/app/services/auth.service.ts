import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUserLoggedIn, IUserLogIn, IUserRegister, IUser, IAdminRegister } from '../models/user.model';
import { UserRoles } from '../utils/storageUserRoles.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() loggedUser: BehaviorSubject<IUserLoggedIn | null> = new BehaviorSubject<IUserLoggedIn | null>(null);
  constructor(private http: HttpClient ) { }
  logout() {
    window.sessionStorage.removeItem('authenticatedUser');
    this.refreshAuthenticatedUser();
  }

  login(user: IUserLogIn): Observable<IUserLoggedIn> {
    return this.http.post<IUserLoggedIn>(`${environment.apiBaseURI}/Auth/Login`, user);
  }

  register(user: IUserRegister): Observable<IUser> {
    return this.http.post<IUser>(`${environment.apiBaseURI}/Auth/Register`, user);
  }

  adminRegister(user: IAdminRegister, admin: IUserLoggedIn | null): Observable<IUser>{
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${admin ? admin.token : null}`
    });  
    var options = {
      headers: headers
    }
    return this.http.post<IUser>(`${environment.apiBaseURI}/Auth/Register/Admin`, user, options);
  }

  getAuthenticatedUser(): Observable<IUserLoggedIn | null> {
    return this.loggedUser.asObservable();
  }

  refreshAuthenticatedUser(): void {
    this.loggedUser.next(this.authenticatedUser);
  }

  get authenticatedUser(): IUserLoggedIn | null{
    var stringifyUser = window.sessionStorage.getItem('authenticatedUser');
    return stringifyUser ? JSON.parse(stringifyUser) : null;
  }

  isAdmin(): boolean{
    var user = this.authenticatedUser? this.authenticatedUser : null;
    return user ? user.roles.includes(UserRoles.Admin): false;
  }
}
