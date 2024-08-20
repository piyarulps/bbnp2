import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractDay'
})
export class ExtractDayPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    
    const date = new Date(value);
    const day = date.getUTCDate();
    
    // Ensure the day is in two-digit format
    return day.toString().padStart(2, '0');
  }

}
