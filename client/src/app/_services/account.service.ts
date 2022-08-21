import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';

  //Create a new New observable
  // will emit the last object inside it, ie the current user object or null
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response : User) => {
        const user = response;
        // This will populate the local storage with the user in the browser
        if (user){
          localStorage.setItem('user', JSON.stringify(user));
          //Set the observable to the user we get from the api, use next
          this.currentUserSource.next(user);
        }
      })
    )
  }

  //Recieve from our register component
  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user : User) => {
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  //Helper method to set the observable to the current user
  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    //Remove the current user from observable
  this.currentUserSource.next(null);
  }
}
