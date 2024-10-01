import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import moment from 'moment-jalaali';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JalaliDatePipe } from '../jalali-date.pipe';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterModule, HttpClientModule,JalaliDatePipe],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
  isLoading: boolean = false;  // کنترل نمایش لودینگ
  startDate: string = '';
  endDate: string = '';
  reportData: any[] = [];

  userId: string = localStorage.getItem('UserId') || '';
  aiResponse: string = ''; // برای ذخیره پاسخ هوش مصنوعی
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    moment.loadPersian({ usePersianDigits: false }); // Force English digits
    this.startDate = moment().format('jYYYY-jMM-jDD'); // Shamsi format
    this.endDate = moment().format('jYYYY-jMM-jDD');
  }

  fetchReport(): void {
    // Convert the Shamsi date to Gregorian format before sending to API
    const startDateEn = moment(this.startDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'); // Convert Shamsi to Gregorian
    const endDateEn = moment(this.endDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');     // Convert Shamsi to Gregorian
  
    // Call the API with Gregorian dates
    this.apiService.getReport(this.userId, startDateEn, endDateEn).subscribe(
      (response) => {
        this.reportData = response; // Store the report data
        console.log('Report received:', response,startDateEn, endDateEn); // Debugging log
      },
      (error) => {
        console.error('Error fetching report:', error); // Handle error
      }
    );
  }

    // متد برای ارسال اطلاعات به هوش مصنوعی
  sendToAI(): void {
    this.isLoading = true; // شروع لودینگ
    const startDateEn = moment(this.startDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');
    const endDateEn = moment(this.endDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');

    this.apiService.sendToAI(this.userId, startDateEn, endDateEn).subscribe(
      (response) => {
        this.aiResponse = response.aiResponse; // ذخیره پاسخ هوش مصنوعی
        this.isLoading = false; // توقف لودینگ
        this.openModal(); // نمایش مدال
      },
      (error) => {
        console.error('Error sending to AI:', error);
        this.isLoading = false; // توقف لودینگ حتی در صورت خطا
      }
    );
  }

  // تابع برای باز کردن مدال
  openModal(): void {
    const modal = document.getElementById('aiAdviceModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  // تابع برای بستن مدال
  closeModal(): void {
    const modal = document.getElementById('aiAdviceModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
  
}