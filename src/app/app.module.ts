import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from  '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoCreateComponent } from './todos/todo-create/todo-create.component';
import { TodoListComponent } from './todos/todo-list/todo-list.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DialogErrorComponent } from './error/dialog-error/dialog-error.component';
import { TodoService } from './../service/todo.service';
import { AlertService } from './../service/alert.service';
import { AuthService } from './../service/auth.service';
import { MaterialModule } from './material.module';

import {QuillModule} from 'ngx-quill';
import { BypassSanitizerPipe } from './utils/bypasssanitizerpipe';
import { AuthInterceptor } from './utils/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    TodoCreateComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    TodoListComponent,
    BypassSanitizerPipe,
    DialogErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    QuillModule.forRoot(),
  ],
  providers: [
    TodoService,
    AuthService,
    AlertService,
    // Configuration of my Auth Interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
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
