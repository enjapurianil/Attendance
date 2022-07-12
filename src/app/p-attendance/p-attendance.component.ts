import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonDetail } from '../entry-person-detail/entry-person-detail.component';
import { WebcamImage, WebcamComponent, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { sessionExample } from '../get-person/get-person.component';

export class Attendance {
  Name!: string;
  IsPresent: boolean = false;
  CheckIn !: string;
  CheckOut !: string;
  PersonId!: number;
  AttendanceId!: number;
  Shifts!: string;
  CreationOn!: string;
  Images!: string;
}
export class tblAttendanceimages {
  AttedanceImageId!: number;
  Images !: string;
  PersonId !: number;
  ImageTypeId!: number;
  TypeName?: string;
}
class audioObj {
  AudioId!:number;
  AudioFile!: string;
}
 export  class ImageType {
  ImageTypeId !: number;
  ImageType!: string;
}


@Component({
  selector: 'app-p-attendance',
  templateUrl: './p-attendance.component.html',
  styleUrls: ['./p-attendance.component.css']
})
export class PAttendanceComponent implements OnInit {

  ImageType!: string;
  ImageTypeId!: number;
  PersonId!: number;
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
  session : sessionExample = new sessionExample();


  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
    private dom: DomSanitizer) { }
  time!: any
  ngOnInit(): void {
    this.OnGetPersonDetail();
    this.OnGetImageTypes();
    setInterval(() => {
      this.time = new Date();
    }, 1000)
    this.getAudio();
  }
  SaveWebCam() { }
  OnGetImageTypes() {
    this.http.get(this.url + "GetImages").subscribe((data: any) => {
      if (data != undefined) {
        this.imageTypes = data;
      }
    })
  }
  OnSessionSubmit(){
    this.http.post(this.url +"Postsessions",this.session).subscribe((data:any) => {
      if(data == true){
        alert("data successfully saved")
      }
      else{
        alert("not saved");
      }
    })
  }
  OnAttendanceSave(person: any) {
console.log(person.images)
    //  this.trigger.next();
    // //using tblAttendanceimages object send the images string to database
    // this.imageAttendance.Images = this.webcamImage.imageAsDataUrl;
    // this.imageAttendance.PersonId = person.PersonId;
    // console.log(this.imageAttendance.Images)
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
        this.http.post(this.url + "SaveAttendanceImagesList", this.imagesAttendance).subscribe((data: any) => {
          if (data == true) {
            alert("Image Upload");
          }
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
  /////////// Audio Recording /////////
  stream!: any;
  chunks!: any;
  recorder!: any;
  pushChucks: audioObj[] = [];
  IsSoundVideo: boolean = false;
  obj: audioObj = new audioObj;
  IsRecord : boolean = false;
  ///////////////////////
  RequestRecord() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(_stream => {
      this.stream = _stream;
      this.IsSoundVideo = true;
      this.recorder = new MediaRecorder(this.stream);
      this.recorder.ondataavailable = (e: any) => {
        this.chunks.push(e.data);
        this.makeLink();
        this.pushChucks.push(this.newUrl)
      }
      this.chunks = [];
    })
  }
  Start() {
    this.IsRecord = true;
    this.recorder.start();
  }
  Stop() {
    this.IsRecord = false;
    this.recorder.stop();
  }
  selectFile!: any;
  newUrl: audioObj = new audioObj();
  newUrls: audioObj[] = [];
  urlSent!:string;
  makeLink() {
    let blob = new Blob(this.chunks, { type: 'audio/ogg' });
    this.newUrl.AudioFile = URL.createObjectURL(blob);
    //   = this.dom.bypassSecurityTrustUrl(_Url);
    this.http.post(this.url + "PostAudio", this.newUrl).subscribe((data: any) => {
      if (data == true) {
        alert(data)
        this.getAudio();
      }
      else {
        alert(false)
      }
    })
  }
  getAudio() {
    this.http.get(this.url + 'GetAudio').subscribe((data: any) => {
      this.newUrls = data;
    })
  }
  urlSendMethod(event:any){
    this.urlSent =this.dom.bypassSecurityTrustUrl(event.target.value) as any;
  }
}
