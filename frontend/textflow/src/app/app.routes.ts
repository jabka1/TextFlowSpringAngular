import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {EditProfileComponent} from "./edit-profile/edit-profile.component";
import {AuthGuard} from "./auth.guard";
import {PostListComponent} from "./posts/posts.component";

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'editProfile', component: EditProfileComponent, canActivate: [AuthGuard] },
    { path: 'posts', component: PostListComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
