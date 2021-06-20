import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AlertService } from './alert.service';
import { TodoApis } from '../app/apis/apis';
import { AuthData } from './../data-models/auth-data.model';
import { User } from 'src/data-models/user.model';

import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  // Suppose If i logout or clear my token, so I have to inform my subscribers dependent on authState of a user.
  // And will push auth info to the comps. which are interested.
  private authState = new BehaviorSubject<{loggedIn: boolean, userDetails: User}>(null);
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }

  createUser(data: AuthData) {
    // const authData: AuthData = {name: data.name, email: data.email, password: data.password};
    return this.http.post<{message: string, token: string, user: User, expiresIn: number}>(TodoApis.signupApi, data);
  }

  login(data) {
    return this.http.post<{message: string, token: string, user: User, expiresIn: number}>(TodoApis.loginApi, data);
  }

  afterAuthentication(token: string, expiresIn: number, user: User) {
    this.token = token;
    // For displaying JW Token expiration on client side.
    this.setAuthTimer(expiresIn);
    this.authState.next({
      loggedIn: true,
      userDetails: user
    });
    const now = new Date();
    // Now I will create a new Date object using my calculated miliseconds.
    const expirationDate = new Date(now.getTime() + (expiresIn * 1000));
    console.log(expirationDate);
    this.saveAuthData(token, expirationDate, user);
  }

  getToken() {
    return this.token;
  }

  authStateListener() {
    return this.authState.asObservable();
  }

  logout() {
    this.token = null;
    this.authState.next({
      loggedIn: false,
      userDetails: null
    });
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigateByUrl('/');
    this.alertService.openSnackBar("Logged Out");
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    // A check if we dont have anything in my localStorage, simply return;
    if (!authData) return;
    // First I will check if the token is still valid from expirationDate
    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();
    console.log(expiresIn);
    // If expiresIn is negative or 0 that means my token is expired.
    if (expiresIn > 0) {
      this.setAuthTimer(expiresIn / 1000);
      this.token = authData.token;
      this.authState.next({
        loggedIn: true,
        userDetails: authData.userDetails
      });
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting Timer: ", duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userDetails: User) {
    localStorage.setItem("token", token);
    // ISOString is Serialize and Standard version of the Date which then I can use to re-create it when I read/get the data later.
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("id", userDetails.id);
    localStorage.setItem("name", userDetails.name);
    localStorage.setItem("email", userDetails.email);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userDetails = {
      id: localStorage.getItem("id"),
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email")
    };
    // A check to confirm that we have token and expirationDate in localStorage.
    if(!token || !expirationDate || !userDetails) return;
    return {
      token: token,
      // Here I can pass that serialized expression date string and it will construct Date object based on that.
      expirationDate: new Date(expirationDate),
      userDetails: userDetails
    };
  }

}
