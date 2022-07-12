import { Injectable, OnInit } from "@angular/core";
@Injectable({
    providedIn : 'root'
})
export class loginService implements OnInit {
    PersonId!:number;
    LoginId!:string;
    password!:string;
    constructor(){}
    ngOnInit(): void {
        
    }
}