import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import moment from 'moment-jalaali';
// Load Persian locale and enable Persian digits
moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';



@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
})
export class CreateTaskComponent implements OnInit {
  tasks: any[] = []; // ذخیره لیست تسک‌ها
  newTaskTitle: string = '';
  aiAdvice: string = '';  // To store AI advice
  selectedDate: moment.Moment = moment().add(1, 'day'); // تاریخ به صورت پیش‌فرض فردا
  formattedDate: string = this.getFormattedDate();
  suggestions: string[] = []; // لیست عنوان تسک‌ها
  cachedTasks: string[] = []; // کش کردن عنوان تسک‌ها
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  userId: string = localStorage.getItem('UserId') || '';
  constructor(private apiService: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getTasksFromApi(); // دریافت تسک‌های روز
    this.apiService.getTasks().subscribe((data) => {
      this.cachedTasks = data; // ذخیره تسک‌ها در متغیر cachedTasks
    });
  }
  //برای اسکرول کردن تسک ها به پایین
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { } 
  }
  // دریافت تاریخ به صورت شمسی
  getFormattedDate(): string {
    return this.selectedDate.format('jD jMMMM jYYYY'); // فرمت تاریخ شمسی به زبان فارسی
  }

  prevDay() {
    this.selectedDate = this.selectedDate.subtract(1, 'day'); // یک روز از تاریخ کم می‌شود
    this.formattedDate = this.getFormattedDate(); // فرمت تاریخ به صورت شمسی
    this.getTasksFromApi(); // دریافت تسک‌ها برای تاریخ جدید
  }

  nextDay() {
    this.selectedDate = this.selectedDate.add(1, 'day'); // یک روز به تاریخ اضافه می‌شود
    this.formattedDate = this.getFormattedDate(); // فرمت تاریخ به صورت شمسی
    this.getTasksFromApi(); // دریافت تسک‌ها برای تاریخ جدید
  }

  // دریافت تسک‌ها برای تاریخ انتخاب شده
  getTasksFromApi() {
    const dateString = this.selectedDate.locale('en').format('YYYY-MM-DD'); // تنظیم زبان به انگلیسی و تبدیل تاریخ به فرمت میلادی
    this.apiService.getTasksForToday(this.userId, dateString).subscribe((data) => {
      this.tasks = data; // ذخیره تسک‌ها
    });
  }

  // نمایش پیشنهادات تسک‌ها
  checkForSuggestions() {
    if (this.newTaskTitle.length > 0 && this.cachedTasks.length > 0) {
      this.suggestions = this.cachedTasks
        .filter((task: any) => task.title.includes(this.newTaskTitle))
        .map((task: any) => task.title);
    } else {
      this.suggestions = [];
    }
  }

  useSuggestion(suggestion: string) {
    this.newTaskTitle = suggestion;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submitTask(); // فراخوانی متد ارسال تسک
    }

  }
  
  
  // ارسال تسک جدید
    submitTask() {
      const newTask = {
        title: this.newTaskTitle,
        dueDate: this.selectedDate.toISOString(),
        createdDate: new Date().toISOString(),
        userId: this.userId, // آی‌دی کاربر
      };

      this.apiService.addTask(newTask).subscribe((response) => {
        console.log('Task created:', response);
        this.getTasksFromApi(); // به‌روزرسانی لیست تسک‌ها پس از افزودن
        this.scrollToBottom();
        this.newTaskTitle = ''; // پاک کردن ورودی

        // بررسی اینکه آیا تعداد تسک‌ها به ۵ رسیده است
        if (this.tasks.length >= 5) {
          this.sendAiAdvice(); // فراخوانی تابع برای دریافت مشاوره
        }
      });
    }

  // حذف تسک
  deleteTask(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId); // حذف تسک از لیست
    this.apiService.deleteTask(taskId).subscribe(() => {
      console.log('Task deleted successfully');
    });
  }

  // ویرایش تسک
  editTask(task: any) {
    const newTitle = prompt('عنوان جدید را وارد کنید:', task.title);
    if (newTitle) {
      task.title = newTitle;
      this.apiService.updateTaskStatus(task.id, newTitle, task.isCompleted).subscribe(() => {
        this.getTasksFromApi(); // به‌روزرسانی لیست تسک‌ها پس از ویرایش
      });
    }
  }

 sendAiAdvice(): void {
    this.apiService.getAiAdvice(this.userId).subscribe(
      (response) => {
        console.log('AI advice received:', response); // Log the response for debugging
        this.aiAdvice = response; // Set the AI advice message
        this.openModal(); // Open the modal after receiving advice
      },
      (error) => {
        console.error('Error fetching AI advice:', error); // Log any error
      }
    );
  }

  // Function to open the modal
  openModal(): void {
    const modalElement = document.getElementById('adviceModal'); // Get the modal element
    if (modalElement) {
      const modal = new Modal(modalElement); // Initialize the modal
      modal.show(); // Show the modal
    }
  }

  // Optional: Function to close the modal (if needed)
  closeModal(): void {
    const modalElement = document.getElementById('adviceModal'); // Get the modal element
    if (modalElement) {
      const modal = Modal.getInstance(modalElement); // Get the instance of the modal
      if (modal) {
        modal.hide(); // Hide the modal
      }
    }
  }
  
}