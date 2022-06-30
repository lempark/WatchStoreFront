import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrder, IOrderRequest } from '../models/order.model';
import { IUserLoggedIn } from '../models/user.model';


@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private http: HttpClient) { }

    getAll(user: IUserLoggedIn | null): Observable<IOrder[]> {
        var headers = new HttpHeaders({
            'Authorization': `Bearer ${user ? user.token : null}`
        });
        var options = {
            headers: headers
        };
        return this.http.get<IOrder[]>(`${environment.apiBaseURI}/Orders`, options);
    }

    createOrder(order: IOrderRequest, user: IUserLoggedIn | null): Observable<IOrder> {
        var headers = new HttpHeaders({
            'Authorization': `Bearer ${user ? user.token : null}`
        });
        var options = {
            headers: headers
        };
        return this.http.post<IOrder>(`${environment.apiBaseURI}/Orders/Create`, order, options);
    }

    completeOrder(orderId: number, user: IUserLoggedIn | null): Observable<IOrder> {
        var headers = new HttpHeaders({
            'Authorization': `Bearer ${user ? user.token : null}`
        });
        var options = {
            headers: headers
        };
        return this.http.put<IOrder>(`${environment.apiBaseURI}/Orders/Complete/${orderId}`, null, options);
    }
}
