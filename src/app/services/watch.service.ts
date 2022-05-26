import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUserLoggedIn } from '../models/user.model';
import { IWatch, IWatchCreateRequest, IWatchFilters } from '../models/watch.model';


@Injectable({
  providedIn: 'root'
})
export class WatchService {
  constructor(private http:HttpClient) { }

    getAll(): Observable<IWatch[]>{
      return this.http.get<IWatch[]>(`${environment.apiBaseURI}/Watches`);
    }

    filterWatches(filters: IWatchFilters): Observable<IWatch[]>{
      return this.http.post<IWatch[]>(`${environment.apiBaseURI}/Watches/Filter`, filters);
    }

    createWatch(watch: IWatchCreateRequest, user: IUserLoggedIn | null): Observable<IWatch>{
      var headers = new HttpHeaders({
        'Authorization': `Bearer ${user ? user.token : null}`
      });  
      var options = {
        headers: headers
      }
      return this.http.post<IWatch>(`${environment.apiBaseURI}/Watches`, watch, options);
    }
    
    deleteWatch(watchId: number, user: IUserLoggedIn | null): Observable<Object>
    {
      var headers = new HttpHeaders({
        'Authorization': `Bearer ${user ? user.token : null}`
      });  
      var options = {
        headers: headers
      }
      return this.http.delete(`${environment.apiBaseURI}/Watches/${watchId}`, options);
    }

    updateWatch(watchId: number, watch: IWatchCreateRequest, user: IUserLoggedIn | null): Observable<IWatch>{
      var headers = new HttpHeaders({
        'Authorization': `Bearer ${user ? user.token : null}`
      });  
      var options = {
        headers: headers
      }
      return this.http.put<IWatch>(`${environment.apiBaseURI}/Watches/${watchId}`, watch, options);
    }
}
