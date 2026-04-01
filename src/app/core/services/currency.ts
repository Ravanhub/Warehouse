import { computed, Injectable, signal } from '@angular/core';

export type SupportedCurrency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyOption {
  code: SupportedCurrency;
  label: string;
  rate: number;
  locale: string;
}

const STORAGE_KEY = 'warehouse-currency';

const OPTIONS: CurrencyOption[] = [
  { code: 'USD', label: 'US Dollar', rate: 1, locale: 'en-US' },
  { code: 'INR', label: 'Indian Rupee', rate: 83.25, locale: 'en-IN' },
  { code: 'EUR', label: 'Euro', rate: 0.92, locale: 'de-DE' },
  { code: 'GBP', label: 'British Pound', rate: 0.78, locale: 'en-GB' },
  { code: 'AED', label: 'UAE Dirham', rate: 3.67, locale: 'en-AE' }
];

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly selectedCode = signal<SupportedCurrency>(this.restore());

  readonly options = OPTIONS;
  readonly selected = computed(() => OPTIONS.find((item) => item.code === this.selectedCode()) ?? OPTIONS[0]);

  setCurrency(code: SupportedCurrency) {
    this.selectedCode.set(code);
    localStorage.setItem(STORAGE_KEY, code);
  }

  convertFromUsd(amount: number) {
    return amount * this.selected().rate;
  }

  formatFromUsd(amount: number) {
    const selected = this.selected();
    return new Intl.NumberFormat(selected.locale, {
      style: 'currency',
      currency: selected.code,
      maximumFractionDigits: 0
    }).format(this.convertFromUsd(amount));
  }

  private restore(): SupportedCurrency {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedCurrency | null;
    return OPTIONS.some((item) => item.code === saved) ? saved! : 'USD';
  }
}