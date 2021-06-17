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
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, res.expiresIn * 1000);
        this.authState.next(true);
        console.log(res);
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
    this.router.navigateByUrl('/');
    this.alertService.openSnackBar("Logged Out");
  }

}
