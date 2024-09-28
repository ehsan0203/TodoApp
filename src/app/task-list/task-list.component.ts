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
    this.taskService.getTasksForToday(userId!, today.toISOString().split('T')[0]).subscribe((response: any) => {
      this.tasks = response;
      this.totalTasks = this.tasks.length;
      this.completedTasks = this.tasks.filter(task => task.isCompleted).length;
    });
  }

  updateTaskStatus(task: any) {
    task.isCompleted = !task.isCompleted;
    
    this.taskService.updateTaskStatus(task.id, task.title, task.isCompleted).subscribe({
      next: (response: any) => {
        if (task.isCompleted) {
          this.completedTasks++;
        } 
        // اگر تسک تیکش برداشته شد، تعداد completedTasks را کاهش بده
        else {
          this.completedTasks--;
        }
      },
      error: (err) => {
        // اگر خطایی رخ داد
        console.error('Failed to update task:', err.error.message);  // نمایش پیام خطا
      }
    });
  }
  

  goToCreateTask() {
    // هدایت به صفحه ایجاد تسک
    this.router.navigate(['/create-task']);
  }

  goToReport() {
    // هدایت به صفحه گزارش
    this.router.navigate(['/report']);
  }
}