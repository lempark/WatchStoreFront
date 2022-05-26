import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrder, IOrderRequest } from '../models/order.model';
import { IUserLoggedIn } from '../models/user.model';
import { IWatch, IWatchCreateRequest, IWatchFilters } from '../models/watch.model';


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

    createOrder(order: IOrderRequest): Observable<IOrder> {
        return this.http.post<IOrder>(`${environment.apiBaseURI}/Orders`, order);
    }

    completeOrder(orderId: number, user: IUserLoggedIn | null): Observable<IOrder> {
        var headers = new HttpHeaders({
            'Authorization': `Bearer ${user ? user.token : null}`
        });
        var options = {
            headers: headers
        };
        return this.http.put<IOrder>(`${environment.apiBaseURI}/Orders${orderId}`, options);
    }
}
