import { NgModule ,CUSTOM_ELEMENTS_SCHEMA ,NO_ERRORS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntryPersonDetailComponent } from './entry-person-detail/entry-person-detail.component';
import { AttendancePersonDetailComponent } from './attendance-person-detail/attendance-person-detail.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { ListAttendanceComponent } from './list-attendance/list-attendance.component';
import { EditAttendanceComponent } from './edit-attendance/edit-attendance.component';
import { SearchAttendancePipe } from './search-attendance.pipe';
import { WebcamModule } from 'ngx-webcam';
import { NgxTimerModule } from 'ngx-timer';
import { PAttendanceComponent } from './p-attendance/p-attendance.component';
import { HelloComponent } from './html/hello/hello.component';
import { UserLoginComponent} from './user-login/user-login.component';
import { AdminLoginComponent} from './admin-login/admin-login.component';
import { GetPersonComponent } from './get-person/get-person.component';
import { AuthInterceptorService } from './AuthInteceptor.service';
import { LoggingInterceptorService } from './LoggingInterceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    EntryPersonDetailComponent,
    AttendancePersonDetailComponent,
    ListAttendanceComponent,
    EditAttendanceComponent,
    SearchAttendancePipe,
    PAttendanceComponent,
    HelloComponent,
    UserLoginComponent,
    GetPersonComponent ,
    AdminLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    WebcamModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS ,useClass :AuthInterceptorService,multi:true},
  {provide :HTTP_INTERCEPTORS,useClass:LoggingInterceptorService,multi:true}],
  bootstrap: [AppComponent],
  schemas : [CUSTOM_ELEMENTS_SCHEMA ,NO_ERRORS_SCHEMA]
})
export class AppModule { }
