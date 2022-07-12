import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from '../user-login/user-login.component';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  constructor(private http :HttpClient,private router : Router) { }
  url: string = 'https://localhost:44367/api/';
  ngOnInit(): void {
  }
  adminSubmit(login :UserLogin ){
    this.http.post(this.url + "PostAdmin",login).subscribe((data:any) => {
      if (data != undefined) {
        alert(data)
        this.router.navigate(['P-Attend']);
      }
      else {
        alert("You entered wrong credential")
      }
    })
  }
}
