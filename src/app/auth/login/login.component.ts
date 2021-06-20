import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { AlertService } from 'src/service/alert.service';
import { AuthService } from 'src/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading = false;

  returnUrl: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private alertService: AlertService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onLogin(form: FormGroup) {
    if (form.valid) {
      console.log(form.value);
      this.returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || '/todos/list';
      this.isLoading = true;
      this.authService.login(form.value)
      .subscribe((res) => {
        if (res.token) {
          this.authService.afterAuthentication(res.token, res.expiresIn, res.user);
        }
        this.router.navigateByUrl(this.returnUrl);
        this.alertService.openSnackBar("Login Successfull.", 4000);
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        console.log(error);
        this.alertService.openSnackBar(error.error.message);
      });
    } else {
      Object.keys(form.controls).forEach((field) => {
        const control = form.get(field);
        control.markAsTouched({onlySelf: true});
      });
      this.alertService.openSnackBar("Please enter all required deatails.", 4000);
    }
  }

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

}
