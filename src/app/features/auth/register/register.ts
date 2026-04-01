import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth';
import { AuthHeroComponent } from '../../../shared/ui/auth-hero/auth-hero';

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthHeroComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly error = signal('');
  protected readonly message = signal('');

  protected readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['USER', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;

    this.error.set('');
    this.message.set('');
    this.submitting.set(true);

    this.auth.register(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.message.set(response.message);
          setTimeout(() => void this.router.navigate(['/login']), 800);
        },
        error: (err) => this.error.set(err.error?.message ?? 'Unable to register')
      });
  }
}
