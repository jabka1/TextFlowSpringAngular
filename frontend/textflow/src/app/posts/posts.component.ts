import { Component, OnInit } from '@angular/core';
import { PostService } from '../posts.service';
import { AuthService } from '../auth.service';
import { CommonModule } from "@angular/common";
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@Component({
  selector: 'app-post-list',
  templateUrl: './posts.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  newPostTitle: string = '';
  newPostContent: string = '';
  showOnlyMyPosts: boolean = false;
  currentUser: string = '';
  editingTitle: string = '';
  editingContent: string = '';
  editingPostId: number | null = null;

  constructor(private postService: PostService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUsername();
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe(posts => {
      this.posts = posts;
      this.filterPosts();
    });
  }

  createPost(): void {
    if (!this.newPostTitle.trim() || !this.newPostContent.trim()) return;

    this.postService.createPost(this.newPostTitle, this.newPostContent).subscribe(() => {
      this.newPostTitle = '';
      this.newPostContent = '';
      this.loadPosts();
    });
  }

  filterPosts(): void {
    this.filteredPosts = this.showOnlyMyPosts
        ? this.posts.filter(post => post.username === this.currentUser)
        : this.posts;
  }

  editPost(post: any): void {
    this.editingPostId = post.id;
    this.editingTitle = post.title;
    this.editingContent = post.content;
  }

  savePost(post: any): void {
    if (!this.editingTitle.trim() || !this.editingContent.trim()) return;

    this.postService.editPost(post.id, this.editingTitle, this.editingContent).subscribe(() => {
      post.title = this.editingTitle;
      post.content = this.editingContent;
      this.editingPostId = null;
    });
  }

  cancelEdit(): void {
    this.editingPostId = null;
  }

  deletePost(id: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id).subscribe(
          () => {
            this.loadPosts();
          },
          (error) => {
            console.error('Error deleting post', error);
          }
      );
      window.location.reload();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
