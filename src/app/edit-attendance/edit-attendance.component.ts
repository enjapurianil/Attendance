import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import {CountupTimerService} from 'ngx-timer';

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
  Pincode!: string;
}
@Component({
  selector: 'app-edit-attendance',
  templateUrl: './edit-attendance.component.html',
  styleUrls: ['./edit-attendance.component.css']
})
export class EditAttendanceComponent implements OnInit {
  public webcamImage!: WebcamImage;
  // toggle webcam on/off
  public deviceId!: string;
  public errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  constructor(private countuptimerservice :CountupTimerService){}
   ngOnInit(): void {
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    console.log(this.webcamImage.imageAsDataUrl)
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

}
