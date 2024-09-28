import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterModule,HttpClientModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent {
  verificationCode: string = '';
  isCodeValid: boolean = false;
  isLoading: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  validateCode() {
    if (this.verificationCode.length === 6) {
      this.isCodeValid = true;
      this.submitVerificationCode();
    } else {
      this.isCodeValid = false;
    }
  }

  submitVerificationCode() {
    this.isLoading = true;
    const storedCode = localStorage.getItem('verificationCode');
    
    if (this.verificationCode === storedCode) {
      const storedPhoneNumber = localStorage.getItem('phoneNumber');

      // استفاده از سرویس برای تأیید کد
      this.apiService.verifyCode(this.verificationCode, storedPhoneNumber!).subscribe({
        next: (response: any) => {
          this.isLoading = false;
  
          if (response && response.userId) {
            localStorage.setItem('UserId', response.userId);
            this.router.navigate(['/task-list']);
          } else {
            alert('کد تأیید نادرست است.');
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error during verification:', err);
          alert('خطا در تأیید کد.');
        }
      });
    } else {
      this.isLoading = false;
      alert('کد تأیید نادرست است.');
    }
  }
}
