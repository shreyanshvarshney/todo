import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from  '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DialogErrorComponent } from './error/dialog-error/dialog-error.component';
import { TodoService } from './../service/todo.service';
import { AlertService } from './../service/alert.service';
import { AuthService } from './../service/auth.service';
import { AuthGuard } from './../guards/auth.guard';

import { AuthInterceptor } from './utils/auth-interceptor';

import { AuthModule } from './auth/auth.module';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DialogErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Todos Module is lazy loaded thats why it is not mentioned here but in routing module, otherwise it will be included in this bundle.
    AuthModule,
    MaterialModule,
  ],
  // Services are only provided in my root module as they have only one instance for whole app.
  providers: [
    TodoService,
    AuthService,
    AlertService,
    AuthGuard,
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
