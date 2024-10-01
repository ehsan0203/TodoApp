import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { TaskListComponent } from './task-list/task-list.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { ReportComponent } from './report/report.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
{path:'verify-code', component:VerifyCodeComponent},
    { path: 'task-list', component: TaskListComponent, canActivate: [AuthGuard] },  // محافظت از این مسیر با AuthGuard
    {path:'task-list',component:TaskListComponent},
    {path:'task-create',component:CreateTaskComponent},
    {path:'report',component:ReportComponent}
];
