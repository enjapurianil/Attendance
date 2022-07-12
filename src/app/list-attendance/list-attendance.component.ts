import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Attendance } from '../attendance-person-detail/attendance-person-detail.component';
import { PersonDetail } from '../entry-person-detail/entry-person-detail.component';

@Component({
  selector: 'app-list-attendance',
  templateUrl: './list-attendance.component.html',
  styleUrls: ['./list-attendance.component.css']
})
export class ListAttendanceComponent implements OnInit {
  searchdata!: string;
  filterData!: string;
  BaseListAttendance: Attendance[] = [];
  ListAttendance: Attendance[] = [];
  person: PersonDetail[] = [];
  attendNew = [];
  personObj: PersonDetail = new PersonDetail();
  objAttendance: Attendance = new Attendance();
  Url: string = 'https://localhost:44367/api/';
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.OnListAttendance();
  }
  OnListAttendance() {
    this.http.get(this.Url + "GetAttendance").subscribe((data: any) => {
      if (data != undefined) {
        this.BaseListAttendance = data;
        this.ListAttendance = data;
        // console.log(this.ListAttendance);
      }
    })
  }
  OnEditattend(id: number) {
    this.router.navigate(['Attendance', id])
  }
  OnDeleteattend(id: number) {
    this.http.delete(this.Url + "DeleteAttendance/" + id).subscribe((data: any) => {
      if (data == true) {
        alert("data deleted")
        this.OnListAttendance();
      }
    })
  }
  OnAttendanceSave(person: any) { }

  Search(data: any) {
    if (this.searchdata != null) {
      this.ListAttendance = this.BaseListAttendance.filter((element: any) => {
        return element.name.toLowerCase().trim() == this.searchdata.toLowerCase();
      });
    }
    else {
      this.ListAttendance = this.BaseListAttendance
    }
  }
}
