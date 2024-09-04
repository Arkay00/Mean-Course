import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {Post} from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'This is the first post\'s content'},
  //   {title: '2nd Post', content: 'This is the 2nd post\'s content'},
  //   {title: '3rd Post', content: 'This is the 3rd post\'s content'}
  // ];
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postsSub: Subscription;
  // postsService: PostsService;
  // constructor(postsService: PostsService){
  //   this.postsService = postsService;
  // }
  constructor(public postsService: PostsService){}

  ngOnInit() {
    this.posts = this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts
      });  
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
