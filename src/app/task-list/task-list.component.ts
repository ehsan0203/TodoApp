import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import moment from 'moment-jalaali';



@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterModule,HttpClientModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  completedTasks: number = 0;
  totalTasks: number = 0;
  currentShamsiDate: string = '';

  constructor(private taskService: ApiService , private router: Router) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('UserId');
    const today = new Date();
    const todayShamsi = moment(today).format('jYYYY/jMM/jDD');
    this.currentShamsiDate = todayShamsi;
    this.sendPendingTasks();
    this.taskService.getTasksForToday(userId!, today.toISOString().split('T')[0]).subscribe((response: any) => {
      this.tasks = response;
      this.totalTasks = this.tasks.length;
      this.completedTasks = this.tasks.filter(task => task.isCompleted).length;
    });
  }

  updateTaskStatus(task: any) {
    task.isCompleted = !task.isCompleted;
    
    // ذخیره در localStorage
    const pendingTasks = JSON.parse(localStorage.getItem('pendingTasks') || '[]');
    pendingTasks.push(task);
    localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
  
    // ارسال درخواست به سرور
    this.taskService.updateTaskStatus(task.id, task.title, task.isCompleted).subscribe({
      next: (response: any) => {
        // تسک به‌درستی ارسال شد
        this.removeTaskFromLocalStorage(task); // حذف تسک از localStorage
        if (task.isCompleted) {
          this.completedTasks++;
        } else {
          this.completedTasks--;
        }
      },
      error: (err) => {
        // تسک به سرور ارسال نشد
        console.error('Failed to update task:', err);
      }
    });
  }


sendPendingTasks() {
  const pendingTasks = JSON.parse(localStorage.getItem('pendingTasks') || '[]');
  if (pendingTasks.length > 0) {
    pendingTasks.forEach((task: any) => {
      this.taskService.updateTaskStatus(task.id, task.title, task.isCompleted).subscribe({
        next: () => {
          this.removeTaskFromLocalStorage(task); // حذف تسک از localStorage پس از ارسال موفقیت‌آمیز
        },
        error: (err) => {
          console.error('Failed to send pending task:', err);
        }
      });
    });
  }
}
  
  removeTaskFromLocalStorage(task: any) {
    const pendingTasks = JSON.parse(localStorage.getItem('pendingTasks') || '[]');
    const updatedTasks = pendingTasks.filter((t: any) => t.id !== task.id);
    localStorage.setItem('pendingTasks', JSON.stringify(updatedTasks));
  }
  


  goToCreateTask() {
    // هدایت به صفحه ایجاد تسک
    this.router.navigate(['/task-create']);
  }

  goToReport() {
    // هدایت به صفحه گزارش
    this.router.navigate(['/report']);
  }
}