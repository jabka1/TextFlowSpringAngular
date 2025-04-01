import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {PostListComponent} from "./posts/posts.component";

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        CommonModule,
        RouterModule,
        HttpClientModule,
        AppComponent,
        LoginComponent,
        RegisterComponent,
        EditProfileComponent,
        PostListComponent
    ],

    providers: [AuthService],
    bootstrap: [AppComponent]
})
export class AppModule {}
