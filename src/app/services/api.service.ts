import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // این سرویس به‌صورت global در دسترس است
})
export class ApiService {

  private baseUrl: string = 'https://localhost:7201/api/';

  constructor(private http: HttpClient) {}

  // ارسال کد تأیید به شماره تلفن
  sendVerificationCode(phoneNumber: string): Observable<any> {
    const apiUrl = `${this.baseUrl}Account/SendVerificationCode?phoneNumber=${phoneNumber}`;
    return this.http.post(apiUrl, { responseType: 'text' });
  }

  // تأیید کد ارسال‌شده
  verifyCode(verificationCode: string, phoneNumber: string): Observable<any> {
    const apiUrl = `${this.baseUrl}Account/VerifyCode?phoneNumber=${phoneNumber}`;
    return this.http.post(apiUrl, { inputCode: verificationCode, phoneNumber });
  }

  // دریافت تسک‌های روز جاری
  getTasksForToday(userId: string, date: string): Observable<any> {
    const apiUrl = `${this.baseUrl}Task/taskDay?userId=${userId}&dateTime=${date}`;
    return this.http.get(apiUrl);
  }

  // آپدیت وضعیت تسک
  updateTaskStatus(taskId: string, title: string, isCompleted: boolean): Observable<any> {
    const apiUrl = `${this.baseUrl}Task/taskUpdate`;
    return this.http.put(apiUrl, { id: taskId, title: title, isCompleted: isCompleted });
  }

  // اضافه کردن تسک جدید
  addTask(task: any): Observable<any> {
    const apiUrl = `${this.baseUrl}Task/addtask`;
    return this.http.post(apiUrl, task);
  }

  // دریافت لیست تسک‌ها
  getTasks(): Observable<any[]> {
    const apiUrl = `${this.baseUrl}Task/findTask`;
    return this.http.get<any[]>(apiUrl);
  }
    // حذف تسک
    deleteTask(taskId: string): Observable<any> {
      const apiUrl = `${this.baseUrl}Task/deleteTask?TaskId=${taskId}`;
      return this.http.delete(apiUrl);
    }

// تابعی برای ارسال درخواست به API
getAiAdvice(userId: string): Observable<any> {
  const options = { responseType: 'text' as 'json' };  // Explicitly set responseType to 'text'
  return this.http.post(`${this.baseUrl}Task/Advices?userId=${userId}`, {}, options);
}



}
