import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // این سرویس به‌صورت global در دسترس است
})
export class ApiService {

  constructor(private http: HttpClient) {}

  // ارسال کد تأیید به شماره تلفن
  sendVerificationCode(phoneNumber: string): Observable<any> {
    const apiUrl = `https://localhost:7201/api/Account/SendVerificationCode?phoneNumber=${phoneNumber}`;
    return this.http.post(apiUrl, { responseType: 'text' });
  }

  // تأیید کد ارسال‌شده
  verifyCode(verificationCode: string, phoneNumber: string): Observable<any> {
    const apiUrl = `https://localhost:7201/api/Account/VerifyCode?phoneNumber=${phoneNumber}`;
    return this.http.post(apiUrl, { inputCode: verificationCode, phoneNumber });
  }
    // دریافت تسک‌های روز جاری
    getTasksForToday(userId: string, date: string): Observable<any> {
      const apiUrl = `https://localhost:7201/api/Task/taskDay?userId=${userId}&dateTime=${date}`;
      return this.http.get(apiUrl);
    }
  
    // آپدیت وضعیت تسک
    updateTaskStatus(taskId: string, title: string, isCompleted: boolean): Observable<any> {
      const apiUrl = 'https://localhost:7201/api/Task/taskUpdate';
      return this.http.put(apiUrl, { id: taskId, title: title, isCompleted: isCompleted });
    }
}
