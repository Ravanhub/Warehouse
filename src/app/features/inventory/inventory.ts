import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CategoryService } from '../../core/services/category';
import { Product, Category } from '../../core/models/api.models';
import { ProductService } from '../../core/services/product';
import { AuthService } from '../../core/services/auth';
import { PricePipe } from '../../shared/ui/pipes/price-pipe';
import { AppShellComponent } from '../../shared/ui/app-shell/app-shell';

@Component({
  standalone: true,
  selector: 'app-inventory-page',
  imports: [CommonModule, ReactiveFormsModule, PricePipe, DatePipe, AppShellComponent],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.css']
})
export class InventoryPageComponent {
  protected readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly products = signal<Product[]>([]);
  protected readonly editingId = signal<number | null>(null);
  protected readonly saving = signal(false);

  protected readonly filterForm = this.fb.nonNullable.group({
    keyword: [''],
    categoryId: ['']
  });

  protected readonly productForm = this.fb.nonNullable.group({
    name: [''],
    price: [0],
    quantity: [0],
    categoryId: [''],
    qrCode: ['']
  });

  constructor() {
    this.categoryService.getCategories().subscribe({
      next: (response) => this.categories.set(response.data)
    });

    this.generateQrCode();
    this.loadProducts();
  }

  loadProducts() {
    const filters = this.filterForm.getRawValue();
    this.productService.getProducts({
      page: 0,
      size: 100,
      sortBy: 'createdAt',
      keyword: filters.keyword || undefined,
      categoryId: filters.categoryId ? Number(filters.categoryId) : null
    }).subscribe({
      next: (response) => this.products.set(response.data.content)
    });
  }

  editProduct(product: Product) {
    this.editingId.set(product.id);
    this.productForm.setValue({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      categoryId: String(product.categoryId),
      qrCode: product.qrCode
    });
  }

  resetEditor() {
    this.editingId.set(null);
    this.productForm.reset({ name: '', price: 0, quantity: 0, categoryId: '', qrCode: '' });
    this.generateQrCode();
  }

  generateQrCode() {
    const nextCode = `WH-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    this.productForm.patchValue({ qrCode: nextCode });
  }

  saveProduct() {
    const raw = this.productForm.getRawValue();
    const payload = {
      name: raw.name,
      price: Number(raw.price),
      quantity: Number(raw.quantity),
      categoryId: Number(raw.categoryId),
      qrCode: raw.qrCode.trim()
    };

    this.saving.set(true);

    const request$ = this.editingId()
      ? this.productService.updateProduct(this.editingId()!, payload)
      : this.productService.createProduct(payload);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.resetEditor();
        this.loadProducts();
      }
    });
  }

  removeProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadProducts()
    });
  }
}
