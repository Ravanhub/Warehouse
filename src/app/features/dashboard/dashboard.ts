import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Product } from '../../core/models/api.models';
import { AuthService } from '../../core/services/auth';
import { PricePipe } from '../../shared/ui/pipes/price-pipe';
import { CategoryService } from '../../core/services/category';
import { ProductService } from '../../core/services/product';
import { AppShellComponent } from '../../shared/ui/app-shell/app-shell';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule,PricePipe, AppShellComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardPageComponent {
  protected readonly chartColors = ['#2b6fff', '#00ba8c', '#ffb95c', '#7c3aed', '#ef4444', '#ec4899'];
  protected readonly auth = inject(AuthService);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  protected readonly products = signal<Product[]>([]);
  protected readonly categories = signal<string[]>([]);

  protected readonly totalProducts = computed(() => this.products().length);
  protected readonly totalCategories = computed(() => this.categories().length);
  protected readonly inventoryValue = computed(() => this.products().reduce((sum, item) => sum + (item.price * item.quantity), 0));
  protected readonly lowStockCount = computed(() => this.products().filter((item) => item.quantity < 10).length);
  protected readonly topLowStock = computed(() => [...this.products()].sort((a, b) => a.quantity - b.quantity).slice(0, 5));
  protected readonly categoryBreakdown = computed(() => {
    const buckets = new Map<string, number>();

    for (const product of this.products()) {
      buckets.set(product.categoryName, (buckets.get(product.categoryName) ?? 0) + 1);
    }

    return [...buckets.entries()].map(([name, count]) => ({
      name,
      count,
      percent: this.totalProducts() ? Math.round((count / this.totalProducts()) * 100) : 0
    }));
  });
  protected readonly monthlyPriceGraph = computed(() => {
    const now = new Date();
    const rolling = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleString('en-US', { month: 'short' }),
        total: 0
      };
    });

    for (const product of this.products()) {
      const created = new Date(product.createdAt);
      const key = `${created.getFullYear()}-${created.getMonth()}`;
      const found = rolling.find((item) => item.key === key);
      if (found) {
        found.total += product.price * product.quantity;
      }
    }

    const max = Math.max(...rolling.map((item) => item.total), 1);

    return rolling.map((item, index) => ({
      ...item,
      x: rolling.length === 1 ? 50 : (index / (rolling.length - 1)) * 100,
      y: Math.max(item.total ? 12 : 6, Math.round((item.total / max) * 100))
    }));
  });

  constructor() {
    forkJoin({
      products: this.productService.getProducts({ page: 0, size: 200, sortBy: 'createdAt' }),
      categories: this.categoryService.getCategories()
    }).subscribe({
      next: ({ products, categories }) => {
        this.products.set(products.data.content);
        this.categories.set(categories.data.map((item) => item.name));
      }
    });
  }

  protected pieGradient() {
    const slices = this.categoryBreakdown();

    if (!slices.length) {
      return 'conic-gradient(#2b6fff 0 100%)';
    }

    let start = 0;
    const stops = slices.map((slice, index) => {
      const end = start + slice.percent;
      const color = this.chartColors[index % this.chartColors.length];
      const rule = `${color} ${start}% ${end}%`;
      start = end;
      return rule;
    });

    return `conic-gradient(${stops.join(', ')})`;
  }
}
