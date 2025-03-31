import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    username = '';
    email = '';
    password = '';
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) {}

    register() {
        if (!this.validateEmail(this.email)) {
            this.errorMessage = 'Invalid email format';
            return;
        }

        if (!this.validatePassword(this.password)) {
            this.errorMessage = 'Password must be at least 6 characters and contain at least one digit';
            return;
        }

        this.authService.register(this.username, this.password, this.email).subscribe({
            next: () => this.router.navigate(['/login']),
            error: () => this.errorMessage = 'Registration error'
        });
    }

    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private validatePassword(password: string): boolean {
        const passwordRegex = /^(?=.*\d).{6,}$/;
        return passwordRegex.test(password);
    }
}
