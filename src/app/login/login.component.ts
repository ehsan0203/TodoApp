import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterModule ,HttpClientModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  phoneNumber: string = '';
  isValid: boolean = false;
  isInvalid: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router, private apiService: ApiService) {}

  validatePhoneNumber() {
    const regex = /^09[0-9]{9}$/;
    if (regex.test(this.phoneNumber)) {
      this.isValid = true;
      this.isInvalid = false;
    } else {
      this.isValid = false;
      this.isInvalid = true;
    }
  }

  submitPhoneNumber() {
    if (this.isValid) {
      this.isLoading = true;

      // استفاده از سرویس برای ارسال کد تأیید
      this.apiService.sendVerificationCode(this.phoneNumber).subscribe({
        next: (response: any) => {
          console.log('Response code:', response);
          localStorage.setItem('verificationCode', response);
          localStorage.setItem('phoneNumber', this.phoneNumber);
          this.isLoading = false;
          this.router.navigate(['/verify-code']);
        },
        error: (err) => {
          console.error('Error sending verification code:', err);
          this.isLoading = false;
          alert('An error occurred while sending the verification code.');
        }
      });
    } else {
      alert('شماره تلفن نامعتبر است.');
    }
  }
}