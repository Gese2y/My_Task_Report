import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyTaskReportComponent } from './my-task-report/my-task-report.component';
// import { RecordComponent } from './record/record.component';
// import { UserRegistrationComponent } from './user-registration/user-registration.component';
// import { ApplicationStatusComponent } from './application-status/application-status.component';


const routes: Routes = [
  {path:'**', component : MyTaskReportComponent},
  // {path:'user', component : UserRegistrationComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
