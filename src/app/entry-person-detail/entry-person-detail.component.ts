import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Attendance } from '../attendance-person-detail/attendance-person-detail.component';
import { loginService } from '../user-login/logic.service';

export class PersonDetail {
  PersonId !: number;
  FirstName !: string;
  LastName !: string;
  Gender !: string;
  DateOfBirth !: Date;
  Age!: number;
  FatherName !: string;
  Aadhar !: number;
  MobileNumber !: number;
  SecondaryContactNumber !: number
  Email !: string;
  DateOfJoining !: Date;
  RegistrationCode !: string;
  Attendances: Attendance = new Attendance();
  IsPresent: boolean = false;
  CheckIn !: Date;
  CheckOut !: Date;
  Shifts!:string;
}
export class Country {
  CountryId!: number;
  CountryName!: string;
}
export class State {
  StateId!: number;
  StateName!: string;
}
export class District {
  DistrictId!: number;
  DistrictName!: string;
}
export class City {
  CityId!: number;
  CityName!: string;
}
export class Pincode {
  PincodeId!: number;
  PincodeNum!: string;
}

@Component({
  selector: 'app-entry-person-detail',
  templateUrl: './entry-person-detail.component.html',
  styleUrls: ['./entry-person-detail.component.css']
})
export class EntryPersonDetailComponent implements OnInit {
  savePerson: PersonDetail = new PersonDetail();
  savePersonDetail: PersonDetail[] = [];
  url: string = 'https://localhost:44367/api/';
  id!: number;
  countries: Country[] = [];
  country: Country = new Country();
  states: State[] = [];
  state: State = new State();
  districts: District[] = [];
  district: District = new District();
  cities: City[] = [];
  city: City = new City();
  pinCode: Pincode = new Pincode();
  pincodes: Pincode[] = [];
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,private loginserive:loginService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.OnEditPerson(this.id);
    this.OnGetCounties();
  }
  dateOfJoin(){
    
  }
  OnSavePerson() {
    let data = new Date();
    let reg = data.getMinutes().toString() + data.getSeconds().toString() +data.getHours().toString();
    this.savePerson.RegistrationCode = "SIB" + reg+ data.getFullYear();
    if (this.id == null) {
      this.http.post(this.url + "SavePersonDetail", this.savePerson).subscribe((data: any) => {
        if (data != undefined) {
          // this.loginserive.LoginId = "userid";
          // this.loginserive.password = data.password;
          alert("data saved" + "Your Registration Code is :" + this.savePerson.RegistrationCode);
          this.router.navigate(['Attendance']);
        }
        else {

          alert("data not saved")
        }
      })
    }
    else {
      this.http.put(this.url + "UpdatePersonDetail", this.savePerson).subscribe((data: any) => {
        if (data == true) {
          alert("data updated");
          this.router.navigate(['Attendance']);
        }
        else {
          alert("data not saved")
        }
      })
    }
  }
  OnEditPerson(id: number) {
    if (id != undefined) {
      this.http.get(this.url + "GetPersonDetailById/" + id).subscribe((data: any) =>
        this.savePerson = data);
    }
  }


  OnGetCounties() {
    this.http.get(this.url + "GetCountries").subscribe((data: any) => this.countries = data)
    console.log(this.countries)
  }
  OnGetStates() {
    if (this.state.StateId > 0) {
      this.http.get(this.url + "GetStates/" + this.state.StateId).subscribe((data: any) => this.states = data)
    }
  }
  OnGetDistricts() {
    console.log(this.district.DistrictId)
    if (this.district.DistrictId > 0) {
      this.http.get(this.url + "GetDistricts/" + this.district.DistrictId).subscribe((data: any) => this.districts = data);
    }
  }
  OnGetCities() {
    if (this.city.CityId > 0) {
      this.http.get(this.url + "Getcities/" + this.city.CityId).subscribe((data: any) => this.cities = data);
    }
  }
  OnGetPinCodes() {
    if (this.pinCode.PincodeId > 0) {
      this.http.get(this.url + "GetPincodes/" + this.pinCode.PincodeId).subscribe((data: any) => this.pincodes = data);
    }
  }
}
