import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { loginService } from './logic.service';
export class UserLogin {
  Username: any;
  Password: any;
}
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  userLoginData: UserLogin = new UserLogin();
  constructor(private http: HttpClient, private router: Router,private service :loginService) { }
  url: string = "https://localhost:44367/api/"
  ngOnInit(): void {
    console.log(this.service.PersonId)
  }
  loginHosp():any {
  // console.log(login)
   console.log(this.userLoginData)
   return  this.service.Post(this.url + "GetPersonDetailByModel", this.userLoginData).subscribe((data: any) => {
      if (data != undefined) {
        console.log(data);
        this.service.PersonId = data.PersonId;
        this.router.navigate(['GetPerson']);
      }
      else {
        alert("You entered wrong credential")
      }
    })
  }
}

