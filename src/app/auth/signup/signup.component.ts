import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from './../../../service/auth.service';
import { AlertService } from 'src/service/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  isLoading= false;

  constructor(private fb: FormBuilder, private authService: AuthService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.signupForm = this.fb.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onSignup(form: FormGroup) {
    if (form.valid) {
      console.log(form.value);
      this.isLoading = true;
      this.authService.createUser(form.value)
      .subscribe((res) => {
        console.log(res.message);
        console.log(res.data);
        this.router.navigate(['/login']);
        this.alertService.openSnackBar("Successfull Signup, Please login with your credentials.", 4000);
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        // errorMessage is coming from my server error response.
        const errorMessage = error.error.message;
        console.log(error.error.message);
        this.alertService.openErrorDialog(errorMessage);
      });
    } else {
      Object.keys(form.controls).forEach((field) => {
        const control = form.get(field);
        control.markAsTouched({onlySelf: true});
      });
      this.alertService.openSnackBar("Please enter all required deatails.", 4000);
    }
  }

  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

}
