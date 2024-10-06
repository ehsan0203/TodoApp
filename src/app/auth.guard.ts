import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const userId = localStorage.getItem('UserId');
    

    if (userId) {
      // هدایت به صفحه "select-lesson"
      this.router.navigate(['/task-list']);
      return false; // اجازه نمی‌دهد که کاربر به صفحه اصلی دسترسی پیدا کند
    }

    return true; // اجازه دسترسی به صفحه فعلی
  }
}
