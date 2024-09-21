import { Component, Input, OnDestroy, OnInit   } from '@angular/core';
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
  isLoading = false;
  private postsSub: Subscription;
  // postsService: PostsService;
  // constructor(postsService: PostsService){
  //   this.postsService = postsService;
  // }
  constructor(public postsService: PostsService) {}

  ngOnInit() {
    // this.posts = this.postsService.getPosts();
    //ich habe die Reihenfolge von subscribe und getPosts umgedreht, da ansonsten (im Gegensatz zum Kurs) die Initialisierung der Posts nicht funktioniert.
    this.isLoading = true;
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
      // console.log('Posts aktualisiert');
    }); 
    this.postsService.getPosts();
  }

  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
