import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { TaskListComponent } from './task-list/task-list.component';

export const routes: Routes = [
    { path: '', component: LoginComponent}, // بررسی با AuthGuard
    { path: 'verify-code', component: VerifyCodeComponent }, // صفحه تایید کد
    {path:'task-list',component:TaskListComponent}
];
