import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    username = '';
    password = '';
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) {}

    login() {
        this.authService.login(this.username, this.password).subscribe({
            next: () => {
                this.router.navigate(['/editProfile']);
            },
            error: (error) => {
                this.errorMessage = error.error || 'Invalid credentials';
            }
        });
    }
}
