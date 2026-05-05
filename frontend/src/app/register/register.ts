import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  password2 = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    if (!this.username || !this.password || !this.password2) {
      this.error = 'Заполните все обязательные поля';
      return;
    }

    if (this.password !== this.password2) {
      this.error = 'Пароли не совпадают';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Пароль должен быть не менее 6 символов';
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      password2: this.password2
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.authService.login(this.username, this.password).subscribe({
          next: () => {
            localStorage.setItem('username', this.username);
            this.router.navigate(['/cats']);
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.router.navigate(['/login']);
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.error = JSON.stringify(err.error, null, 2);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}