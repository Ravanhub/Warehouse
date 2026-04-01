import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth';
import { AuthHeroComponent } from '../../../shared/ui/auth-hero/auth-hero';

@Component({
  standalone: true,
  selector: 'app-forgot-password-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthHeroComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly submitting = signal(false);
  protected readonly error = signal('');
  protected readonly message = signal('');
  protected readonly token = signal('');

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submit() {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.error.set('');
    this.message.set('');
    this.token.set('');

    this.auth.forgotPassword(this.form.getRawValue().email)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.message.set(response.message);
          this.token.set(response.data);
        },
        error: (err) => this.error.set(err.error?.message ?? 'Unable to process request')
      });
  }
}
