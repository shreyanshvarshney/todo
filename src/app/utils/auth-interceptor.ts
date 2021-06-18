// This interceptor is type of Service only.
// I can also manually add Authorization header in every request, but using this is also a good option
// with less amount of code and setting auth header Globally in every request.
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from 'src/service/auth.service';

// @Injectable() decorator function is needed to inject auth service in this interceptor service
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {} 

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();
        const request = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + token)
        });
        return next.handle(request);
    }
}
