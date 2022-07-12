import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonDetail } from '../entry-person-detail/entry-person-detail.component';
import { WebcamImage, WebcamComponent, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

export class Attendance {
  Name?: string;
  IsPresent: boolean = false;
  CheckIn !: string;
  CheckOut !: string;
  PersonId!: number;
  AttendanceId!: number;
  Shifts!: string;
  CreationOn!: string;
  Images?: string;
}
export class tblAttendanceimages {
  AttedanceImageId!: number;
  Images !: string;
  PersonId !: number;
  Type!: string;
  TypeName!: string;
  ImageId!:number;
  ImageTypeId!: number;
}


class ImageType {
  ImageTypeId !: number;
  ImageType!: string;
}

@Component({
  selector: 'app-attendance-person-detail',
  templateUrl: './attendance-person-detail.component.html',
  styleUrls: ['./attendance-person-detail.component.css']
})
export class AttendancePersonDetailComponent implements OnInit {
  ImageType!: string;
  ImageTypeId!:number;
  imageTypes: ImageType[] = [];
  Timer!: any;
  timerCompleted($event: any) {
    console.log($event)
  }

  imageAttendance: tblAttendanceimages = new tblAttendanceimages();
  imagesAttendance: tblAttendanceimages[] = [];
  getPersonDetails: PersonDetail[] = [];
  getPerson: PersonDetail = new PersonDetail();
  attendance: Attendance = new Attendance();
  url: string = 'https://localhost:44367/api/';
  date: Date = new Date();


  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }
  time!: any
  ngOnInit(): void {
    this.OnGetPersonDetail();
    this.OnGetImageTypes();
    setInterval(() => {
      this.time = new Date();
    }, 1000)
    let id= this.route.snapshot.params['id'];
  }
  SaveWebCamImage() { }
  OnGetImageTypes() {
    this.http.get(this.url + "GetImages").subscribe((data: any) => {
      if (data != undefined) {
        this.imageTypes = data;
      }
    })
  }
  OnAttendanceSave(person: any) {

  //  this.trigger.next();
    //using tblAttendanceimages object send the images string to database
    this.imageAttendance.Images = this.webcamImage.imageAsDataUrl;
    this.imageAttendance.PersonId = person.PersonId;
    console.log(this.imageAttendance.Images)
    // end tblAttendance code
    // using attendance object send the user attendance to database
    this.attendance.CheckIn = person.CheckIn;
    this.attendance.CheckOut = person.CheckOut;
    this.attendance.PersonId = person.PersonId;
    this.attendance.IsPresent = person.IsPresent;

    if (person.CheckIn != undefined) {
      this.attendance.IsPresent = true;
    }
    let newDate = new Date()
    this.attendance.CreationOn = newDate.toLocaleDateString();
    console.log(this.attendance.CreationOn)
    //end attendance onj code
    // save and update attendance through getting attendance
    this.http.get(this.url + "GetAttendance").subscribe((data: any) => {
      let bool: boolean = true;
      data.forEach((ele: any) => {
        if (ele.PersonId == this.attendance.PersonId && ele.CreationOn == this.attendance.CreationOn) {
          bool = false;
        }
      })
      if (bool == true) {
        this.http.post(this.url + "SaveAttendance", this.attendance).subscribe((data: any) => {
          if (data == true) {
            alert("data attend");
          }
          else {
            alert("data not attend");
          }
        });
        this.imagesAttendance.forEach(element => {
          debugger;
          this.http.post(this.url + "SaveAttendanceImages", element).subscribe();
        });
        // person.IsPresent = !person.IsPresent;
      }
      else {
        this.attendance.CreationOn = newDate.toLocaleDateString();
        this.http.put(this.url + "UpdateAttendance", this.attendance).subscribe((data: any) => {
          if (data == true) {
            alert("new data updated");
          }
          else {
            alert("data not found");
          }
        });
        this.http.put(this.url + "UpdateAttendanceImages", this.imageAttendance).subscribe();
        // person.IsPresent = !person.IsPresent;
      }
    })
  }
  OnGetPersonDetail() {
    this.http.get(this.url + "GetPersonDetails").subscribe((data: any) => {
      this.getPersonDetails = data;
    });
  }
  OnEditPerson(id: number) {
    this.router.navigate(['Entry_Person', id])
  }
  OnDeletePerson(id: number) {
    this.http.delete(this.url + "DeletePersonDetailById/" + id).subscribe((data: any) => {
      if (data == true) {
        alert("data deleted")
      }
      else {
        alert("data not deleted")
      }
    })
    this.OnGetPersonDetail();
  }
  Present(person: any) {
    person.IsPresent = !person.IsPresent
  }
  ///////////////////////////////
  //  WEB-CAM CODE             //
  //////////////////////////////
  // hide: boolean = true;
  public webcamImage!: WebcamImage;
  // toggle webcam on/off
  public deviceId!: string;
  public errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId

  public triggerSnapshot(type:any): void {
    this.ImageType = type.ImageType;
    this.ImageTypeId = type.ImageTypeId;
    this.trigger.next();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    console.log(this.webcamImage.imageAsDataUrl);
    var imageAttend: tblAttendanceimages = new tblAttendanceimages();
    imageAttend.Type = this.webcamImage.imageAsDataUrl;
    imageAttend.TypeName = this.ImageType;
    imageAttend.ImageId = this.ImageTypeId;
    this.imagesAttendance.push(imageAttend);
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  yourOwnFunction() { }
  hours!: any;
  minutes!: any;
  seconds!: any;
  hrs!: any;
  min!: any;
  sec!: any;
  interval!: any;
  startTimre() {
    setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
        this.sec = this.seconds
        if (this.hours > 0 && this.minutes > 0 && this.seconds == 0) {
          this.hours--;
          this.minutes = 59
          this.hrs = this.hours;
        }
        if (this.minutes > 0 && this.seconds == 0) {
          this.minutes--;
          this.seconds = 59;
          this.min = this.minutes;
          this.sec = this.seconds;
        }
      }
    }, 1000)
  }
  stop() {
    clearInterval(this.interval)
  }
}
