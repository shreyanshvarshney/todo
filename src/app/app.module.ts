import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from  '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DialogErrorComponent } from './error/dialog-error/dialog-error.component';
import { TodoService } from './../service/todo.service';
import { AlertService } from './../service/alert.service';
import { AuthService } from './../service/auth.service';

import { AuthInterceptor } from './utils/auth-interceptor';

import { TodosModule } from './todos/todos.module';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    DialogErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    TodosModule,
    MaterialModule,
  ],
  providers: [
    TodoService,
    AuthService,
    AlertService,
    // Configuration of my Auth Interceptor
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],

  // Since I am going a load a component that is neither rendered through a selector nor routing.
  // And I am creating this component dynamically or let that alert service create that.
  // So I have to tell angular about that component in entryComponents array.
  entryComponents: [
    DialogErrorComponent
  ]
})
export class AppModule { }
