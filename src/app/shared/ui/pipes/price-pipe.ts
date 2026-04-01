import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyService } from '../../../core/services/currency';

@Pipe({
  name: 'appPrice',
  standalone: true,
  pure: false
})
export class PricePipe implements PipeTransform {
  private readonly currencyService = inject(CurrencyService);

  transform(value: number | null | undefined): string {
    return this.currencyService.formatFromUsd(value ?? 0);
  }
}
