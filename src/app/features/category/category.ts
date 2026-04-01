import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Category } from '../../core/models/api.models';
import { CategoryService } from '../../core/services/category';
import { AppShellComponent } from '../../shared/ui/app-shell/app-shell';

@Component({
  standalone: true,
  selector: 'app-category-management-page',
  imports: [CommonModule, ReactiveFormsModule, AppShellComponent],
  templateUrl: './category.html',
  styleUrls: ['./category.css']
})
export class CategoryManagementPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly saving = signal(false);
  protected readonly message = signal('');
  protected readonly error = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required]
  });

  constructor() {
    this.loadCategories();
  }

  protected loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => this.categories.set(response.data)
    });
  }

  protected submit() {
    if (this.form.invalid) return;

    this.message.set('');
    this.error.set('');
    this.saving.set(true);

    this.categoryService.createCategory(this.form.getRawValue())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.message.set(response.message);
          this.form.reset({ name: '' });
          this.loadCategories();
        },
        error: (err) => this.error.set(err.error?.message ?? 'Unable to create category')
      });
  }
}
