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
      // اگر UserId در localStorage وجود دارد، به کاربر اجازه ورود به صفحه‌های مجاز را می‌دهد.
      return true;
    } else {
      // اگر UserId وجود ندارد، به صفحه لاگین هدایت می‌شود.
      this.router.navigate(['']);
      return false;
    }
  }
}
