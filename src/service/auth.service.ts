import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { TodoApis } from '../app/apis/apis';
import { AuthData } from './../data-models/auth-data.model';
import { User } from 'src/data-models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

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

  login(data) {
    return this.http.post<{message: string, token: string}>(TodoApis.loginApi, data);
  }

}
