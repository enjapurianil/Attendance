import { HttpClient, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { loginService } from "./user-login/logic.service";

@Injectable({
    providedIn :'root'
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private loginservice : loginService){}
    token?: string = this.loginservice.LoginId;
    tokenId?: string = this.loginservice.password;
    
    modifiedRequest?: any;
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        
            this.modifiedRequest = req.clone({
                headers: req.headers.append(`${this.token}`, `${this.tokenId}`),
              //  params: req.params.append('name', 'anil')
            })
            console.log("request from interceptors")
        
        return next.handle(this.modifiedRequest)

    }
}