import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency'
})
export class CurrencySymbolPipe implements PipeTransform {

  transform(value: number, currency: string = '₹'): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Convert the number to string and split it into parts
    let parts = value.toString().split('.');
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? `.${parts[1]}` : '';

    // Format the integer part with commas according to the Indian numbering system
    let lastThreeDigits = integerPart.slice(-3);
    let otherDigits = integerPart.slice(0, -3);

    if (otherDigits !== '') {
      lastThreeDigits = ',' + lastThreeDigits;
    }

    let formattedIntegerPart = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThreeDigits;

    return `${currency} ${formattedIntegerPart}${decimalPart}`;
  }

}
