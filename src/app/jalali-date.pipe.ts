import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-jalaali';  // کتابخانه moment-jalaali را وارد کنید
@Pipe({
  name: 'jalaliDate',
  standalone: true
})
export class JalaliDatePipe implements PipeTransform {
  transform(value: string): string {
    // تبدیل تاریخ میلادی به تاریخ شمسی با فرمت دلخواه
    return moment(value).format('jYYYY/jMM/jDD');
  }
}