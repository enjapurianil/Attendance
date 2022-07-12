import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { tblAttendanceimages, Attendance } from '../attendance-person-detail/attendance-person-detail.component';
import { PersonDetail } from '../entry-person-detail/entry-person-detail.component';
import { ImageType } from '../p-attendance/p-attendance.component';
import { loginService } from '../user-login/logic.service';

export class sessionExample {
  sessiontype!: string;
  sessionstarttime!: string;
  sessionendtime!: string;
}

@Component({
  selector: 'app-get-person',
  templateUrl: './get-person.component.html',
  styleUrls: ['./get-person.component.css']
})
export class GetPersonComponent implements OnInit {
  paramsId!: number;
  ImageType!: string;
  ImageTypeId!: number;
  PersonId!: number;
  imageTypes: ImageType[] = [];
  Timer!: any;
  timerCompleted($event: any) {
    console.log($event)
  }
  IsLateAttendance: boolean = false;
  LateTime!: any;
  reasonForLate!: string;
  imageAttendance: tblAttendanceimages = new tblAttendanceimages();
  imagesAttendance: tblAttendanceimages[] = [];
  getPersonDetails: PersonDetail[] = [];
  getPerson: PersonDetail = new PersonDetail();
  attendance: Attendance = new Attendance();
  url: string = 'https://localhost:44367/api/';
  date: Date = new Date();
  session: sessionExample[] = [];
  sessionobj: sessionExample = new sessionExample();
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
    private dom: DomSanitizer, private service: loginService) { }
  time!: any
  ngOnInit(): void {
    this.OnGetImageTypes();
    // this.paramsId = this.route.snapshot.params['id'];  
    this.paramsId = this.service.PersonId;
    if (this.paramsId == null || this.service.PersonId < 1) {
      this.router.navigate(['/login'])
    }
    this.OnGetPersonDetail(this.paramsId);
    setInterval(() => {
      this.time = new Date();
    }, 1000)
    this.OnGetSessions();
  }
  Logout() {
    this.service.PersonId = 0;
    if (this.paramsId == null || this.service.PersonId < 1) {
      this.router.navigate(['/login'])
    }
  }
  getAudio() {
    throw new Error('Method not implemented.');
  }
  SaveWebCam() { }
  OnGetImageTypes() {
    this.http.get(this.url + "GetImages").subscribe((data: any) => {
      if (data != undefined) {
        this.imageTypes = data;
      }
    })
  }
  OnGetSessions() {
    this.http.get(this.url + "Getsessions").subscribe((data: any) => {
      data.find((element: any) => {
        let date = new Date(new Date().toString().split('GMT')[0] + 'UTC').toISOString().split('.')[0];
        let present = date.split(":")
        let d = present[0] + ":" + present[1];
        console.log(present[0] + ":" + present[1], element.sessionendtime, element.sessionstarttime)
        if (element.sessionstarttime < d && element.sessionendtime > d) {
          this.sessionobj = element;
        }
      });
    })
  }
  OnLateAttendanceDisable() {
    if (this.reasonForLate != undefined && this.reasonForLate.length >= 10) {
      this.IsLateAttendance = false;
    }

  }
  OnAttendanceSave(person: any) {
    // using attendance object send the user attendance to database
    let d = new Date();
    // this.attendance.CheckIn = person.CheckIn;
    // this.attendance.CheckOut = person.CheckOut;
    this.attendance.PersonId = person.PersonId;
    this.attendance.IsPresent = person.IsPresent;
    if (person.CheckIn != undefined) {
      this.attendance.CheckIn = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() +
        "T" + d.getHours() + ":" + d.getMinutes();

      let present = this.sessionobj.sessionstarttime.split("T")[1];
      let att = this.attendance.CheckIn.split("T")[1];
      let A1 = parseInt(present.split(":")[0]) * 60 + parseInt(present.split(":")[1]);
      let A2 = parseInt(att.split(":")[0]) * 60 + parseInt(att.split(":")[1]);
      console.log(A1, A2)
      if (A1 < A2) {
        this.LateTime = (A2 - A1);
        this.IsLateAttendance = true;
      }
    }

    if (person.CheckOut != undefined) {
      this.attendance.CheckOut = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() +
        "::" + d.getHours() + ":" + d.getMinutes();
    }
    this.attendance.CreationOn = d.toLocaleDateString();
    //end attendance obj code

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
        this.http.post(this.url + "SaveAttendanceImagesList", this.imagesAttendance).subscribe((data: any) => {
          if (data == true) {
            alert("Image Upload");
          }
        });
        // person.IsPresent = !person.IsPresent;
      }
      else {
        this.attendance.CreationOn = d.toLocaleDateString();
        this.http.put(this.url + "UpdateAttendance", this.attendance).subscribe((data: any) => {
          if (data == true) {
            alert("new data updated");
          }
          else {
            alert("data not found");
          }
        });
        this.http.put(this.url + "UpdateAttendanceImagesList", this.imagesAttendance).subscribe((data: any) => {
          if (data == true) {
            alert("image updated");
          }
          else {
            alert("image not found");

          }
        });
        // person.IsPresent = !person.IsPresent;
      }
    })
  }
  OnGetPersonDetail(id: number) {
    if (id != null) {
      this.http.get(this.url + "GetPersonDetailById/" + id).subscribe((data: any) => {
        this.getPerson = data;
      });
    }
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
  }
  Present(person: any) {
    this.imagesAttendance = [];
    person.IsPresent = !person.IsPresent
  }
  CloseDialog(person: { IsPresent: boolean; }) {
    person.IsPresent = !person.IsPresent;
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

  public triggerSnapshot(type: any, person: any): void {
    this.imageAttendance = new tblAttendanceimages();
    this.ImageType = type.ImageType;
    this.ImageTypeId = type.ImageTypeId;
    this.PersonId = person.PersonId;
    this.trigger.next();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    // console.log(this.webcamImage.imageAsDataUrl);
    this.imageAttendance.Images = this.webcamImage.imageAsDataUrl;
    this.imageAttendance.TypeName = this.ImageType;
    this.imageAttendance.ImageTypeId = this.ImageTypeId;
    this.imageAttendance.PersonId = this.PersonId;
    this.imagesAttendance.push(this.imageAttendance);
    if (this.imagesAttendance.length > 0) {
      for (let i = 0; i < this.imagesAttendance.length; i++) {
        if (this.imagesAttendance[i].ImageTypeId == this.imageAttendance.ImageTypeId) {
          this.imagesAttendance[i] = this.imageAttendance;
        }
      }
    }
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  yourOwnFunction() { }
  Remove(i: number) {
    this.imagesAttendance.splice(i, 1);
  }

  hours!: any;
  minutes!: any;
  seconds!: any;
  hrs!: any;
  min!: any;
  sec!: any;
  interval!: any;
  IsSound: boolean = false;
  IsStop: boolean = true;
  startTimre() {
    if (this.seconds != undefined)
      this.interval = setInterval(() => {
        if (this.seconds > 0) {
          this.seconds--;
        }
        if (this.seconds == 0 && this.minutes > 0) {
          this.minutes--;
          this.seconds = 59;
        }
        if (this.minutes == 0 && this.seconds == 0 && this.hours > 0) {
          this.hours--;
          this.minutes = 60;
        }
        if (this.minutes == 0 && this.seconds == 0 && this.hours == 0) {
          this.IsSound = true;
          clearInterval(this.interval)
        }
        if (this.minutes == !0 || this.seconds == !0 || this.hours == !0) {
          this.IsSound = false;
        }
      }, 1000)
    this.IsStop = false;
  }
  stopTimer() {
    clearInterval(this.interval);
    this.IsStop = true;
  }




}
