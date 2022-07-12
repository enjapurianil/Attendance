import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AttendancePersonDetailComponent } from './attendance-person-detail/attendance-person-detail.component';
import { EditAttendanceComponent } from './edit-attendance/edit-attendance.component';
import { EntryPersonDetailComponent } from './entry-person-detail/entry-person-detail.component';
import { GetPersonComponent } from './get-person/get-person.component';
import { ListAttendanceComponent } from './list-attendance/list-attendance.component';
import { NikilComponent } from './nikil/nikil.component';
import { PAttendanceComponent } from './p-attendance/p-attendance.component';
import { UserLoginComponent } from './user-login/user-login.component';

const routes: Routes = [
  { path: '', redirectTo: 'Attendance', pathMatch: 'full' },
  { path: 'Entry_Person', component: EntryPersonDetailComponent },
  { path: 'Entry_Person/:id', component: EntryPersonDetailComponent },
  { path: 'Attendance', component: AttendancePersonDetailComponent, children: [] },
  { path: 'Attendance/:id', component: AttendancePersonDetailComponent },
  { path: 'EditAttendance', component: EditAttendanceComponent },
  { path: 'EditAttendance/:id', component: EditAttendanceComponent },
  { path: 'listAttendance', component: ListAttendanceComponent },
  { path: 'P-Attend', component: PAttendanceComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'admin', component: AdminLoginComponent },
  { path: 'GetPerson', component: GetPersonComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
