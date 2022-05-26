import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBrand, ICategory, IWatch } from '../models/watch.model';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http:HttpClient) { }

    getAll(): Observable<ICategory[]>{
      return this.http.get<ICategory[]>(`${environment.apiBaseURI}/Categories`);
    }
}
