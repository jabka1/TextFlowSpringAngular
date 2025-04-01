import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit-profile.component.html',
  standalone: true
})
export class EditProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  newEmail: string = '';
  newPassword: string = '';
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (response: any) => {
        this.username = response.username;
        this.email = response.email;
      },
      error: (error) => {
        this.message = error.error || 'Error fetching user data';
      }
    });
  }

  updateEmail() {
    if (!this.validateEmail(this.newEmail)) {
      this.message = 'Invalid email format';
      return;
    }
    this.authService.updateEmail(this.newEmail).subscribe({
      next: () => { },
      error: () => {
        this.message = 'Failed to update email';
        return;
      }
    });
    window.location.reload();
  }

  updatePassword() {
    if (!this.validatePassword(this.newPassword)) {
      this.message = 'Password must be at least 6 characters and contain at least one digit';
      return;
    }
    this.authService.updatePassword(this.newPassword).subscribe({
      next: () => {},
      error: () => {
        this.message = 'Failed to update password';
      }
    });
    this.router.navigate(['/login']).then(() => {
      this.authService.logout();
      window.location.reload();
    });
  }

  deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    this.authService.deleteAccount().subscribe({
      next: () => { },
      error: (error) => {
        this.message = error.error || 'Failed to delete account';
      }
    });
    this.router.navigate(['/register']).then(() => {
      this.authService.logout();
      window.location.reload();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
