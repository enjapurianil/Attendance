import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
@Injectable({
    providedIn : 'root'
})
export class loginService implements OnInit {
    PersonId!:number;
    LoginId!:string;
    password!:string;
    constructor(private http : HttpClient){}
    ngOnInit(): void {
        
    }
    isAuthenticate : boolean = false
    Post(url:string,user:any):any{
       return this.http.post(url,user);
    }
}