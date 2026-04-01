import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CurrencyService, SupportedCurrency } from '../../../core/services/currency';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.html',
  styleUrls: ['./app-shell.css']
})
export class AppShellComponent {
  readonly title = input.required<string>();
  protected readonly auth = inject(AuthService);
  protected readonly currency = inject(CurrencyService);
  protected readonly roleLabel = computed(() => this.auth.isAdmin() ? 'Admin mode' : 'User mode');

  protected changeCurrency(code: SupportedCurrency) {
    this.currency.setCurrency(code);
  }
}
