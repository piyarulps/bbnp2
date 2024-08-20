import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tenure'
})
export class TenurePipe implements PipeTransform {

  transform(endDate: string): string {
    const end = new Date(endDate);
    const today = new Date(); // Current date
    const diff = Math.abs(today.getTime() - end.getTime());

    const years = Math.floor(diff / (1000 * 3600 * 24 * 365));
    const months = Math.floor((diff % (1000 * 3600 * 24 * 365)) / (1000 * 3600 * 24 * 30));
    const days = Math.floor((diff % (1000 * 3600 * 24 * 30)) / (1000 * 3600 * 24));

    let result = '';

    if (years > 0) {
      result += `${years} years`;
    }

    if (months > 0) {
      if (result) result += ', ';
      result += `${months} months`;
    }

    if (days > 0 || !result) { // Show days if there are days or if there's nothing else
      if (result) result += ', ';
      result += `${days} days`;
    }

    return result || '0 days'; // Default to '0 days' if everything is zero
  }

}
