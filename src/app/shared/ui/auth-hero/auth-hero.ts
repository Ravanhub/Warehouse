import { Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-hero',
  standalone: true,
  templateUrl: './auth-hero.html',
  styleUrls: ['./auth-hero.css'],
})
export class AuthHeroComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
