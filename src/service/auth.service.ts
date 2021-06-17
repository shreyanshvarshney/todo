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
  private authState = new BehaviorSubject<boolean>(false);
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }

  createUser(data: AuthData) {
    // const authData: AuthData = {name: data.name, email: data.email, password: data.password};
    return this.http.post<{message: string, data: User}>(TodoApis.signupApi, data)
    .pipe(
      map((res: any) => {
        return {
          message: res.message,
          data: {
            id: res.data._id,
            name: res.data.name,
            email: res.data.email
          }
        };
      })
    );
  }

  login(data, returnUrl: string) {
    return this.http.post<{message: string, token: string, user: User, expiresIn: number}>(TodoApis.loginApi, data)
    .subscribe((res) => {
      this.token = res.token;
      if (res.token) {
        // For displaying JW Token expiration on client side.
        this.setAuthTimer(res.expiresIn);
        this.authState.next(true);
        console.log(res);
        const now = new Date();
        // Now I will create a new Date object using my calculated miliseconds.
        const expirationDate = new Date(now.getTime() + (res.expiresIn * 1000));
        console.log(expirationDate);
        this.saveAuthData(res.token, expirationDate);
        this.router.navigateByUrl(returnUrl);
        this.alertService.openSnackBar("Login Successfull.");
      }
    },
    (error: HttpErrorResponse) => {
      console.log(error);
      this.alertService.openSnackBar("Please enter correct login details.")
    });
  }

  getToken() {
    return this.token;
  }

  authStateListener() {
    return this.authState.asObservable();
  }

  logout() {
    this.token = null;
    this.authState.next(false);
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
      this.authState.next(true);
      this.token = authData.token;
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting Timer: ", duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    // ISOString is Serialize and Standard version of the Date which then I can use to re-create it when I read/get the data later.
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    // A check to confirm that we have token and expirationDate in localStorage.
    if(!token || !expirationDate) return;
    return {
      token: token,
      // Here I can pass that serialized expression date string and it will construct Date object based on that.
      expirationDate: new Date(expirationDate)
    };
  }

}
