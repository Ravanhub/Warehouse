import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth';
import { AuthHeroComponent } from '../../../shared/ui/auth-hero/auth-hero';

@Component({
  standalone: true,
  selector: 'app-reset-password-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthHeroComponent],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly error = signal('');
  protected readonly message = signal('');

  protected readonly form = this.fb.nonNullable.group({
    token: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit() {
    if (this.form.invalid) return;

    const { token, password } = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set('');
    this.message.set('');

    this.auth.resetPassword(token, password)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.message.set(response.message);
          setTimeout(() => void this.router.navigate(['/login']), 900);
        },
        error: (err) => this.error.set(err.error?.message ?? 'Unable to update password')
      });
  }
}
