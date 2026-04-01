import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppShellComponent } from '../../../shared/ui/app-shell/app-shell';

@Component({
  standalone: true,
  selector: 'app-admin-home-page',
  imports: [CommonModule, RouterLink, AppShellComponent],
  templateUrl: './admin-home-page.html',
  styleUrls: ['./admin-home-page.css']
})
export class AdminHomePageComponent {}
