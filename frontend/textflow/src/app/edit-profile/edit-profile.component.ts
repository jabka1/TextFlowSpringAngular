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
      next: () => {
        this.message = 'Email updated successfully';
      },
      error: (error) => {
        this.message = error.error || 'Failed to update email';
      }
    });
  }

  updatePassword() {
    if (this.newPassword.length < 6) {
      this.message = 'Password must be at least 6 characters';
      return;
    }

    this.authService.updatePassword(this.newPassword).subscribe({
      next: () => {
        this.message = 'Password updated successfully';
      },
      error: (error) => {
        this.message = error.error || 'Failed to update password';
      }
    });
  }

  deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    this.authService.deleteAccount().subscribe({
      next: () => {
        alert('Account deleted successfully');
        this.router.navigate(['/register']);
      },
      error: (error) => {
        this.message = error.error || 'Failed to delete account';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
