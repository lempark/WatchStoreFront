import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBrand, IWatch } from '../models/watch.model';


@Injectable({
  providedIn: 'root'
})
export class BrandService {
  constructor(private http:HttpClient) { }

    getAll(): Observable<IBrand[]>{
      return this.http.get<IBrand[]>(`${environment.apiBaseURI}/Brands`);
    }
}
