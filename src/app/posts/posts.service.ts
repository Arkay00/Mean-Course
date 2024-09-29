import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; //for mapping within observable
// import { response } from 'express';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    // return [...this.posts];
    this.http
      // .get<{message: string, posts: Post[]}>
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      // pipe accepts multiple operators within observable
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    // return {...this.posts.find(post => post.id === id)};

    //Achtung, in einer Subscription kann nur synchroner Code zurückgegeben werden! (asynchron gleich läuft irgenwann mit Antwort ein)
    // return this.http.get<{ post : { _id: string, title: string, content: string}}>('http://localhost:3000/api/posts/' + postId);
    return this.http.get<{
      post: { _id: string; title: string; content: string; imagePath: string };
    }>('http://localhost:3000/api/posts/' + postId);
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = {id: null, title: title, content: content};
    //FormData allows to combine Text- and Blob data
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      //   .post<{ message: string; postId: string }>(
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        // post
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          //   id: responseData.postId,
          //   title: title,
          //   content: content,
          id: responseData.post.id,
          title: responseData.post.title,
          content: responseData.post.content,
          imagePath: responseData.post.imagePath,
        };
        // console.log(responseData.message);
        // const id = responseData.postId;
        // post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
    // this.posts.push(post);
    // this.postsUpdated.next([...this.posts]);
  }

  updatePost(
    postId: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    // const post: Post = {
    //   id: postId,
    //   title: title,
    //   content: content,
    //   imagePath: null,
    // };
    this.http
      .put<{ message: string }>(
        'http://localhost:3000/api/posts/' + postId,
        postData
      )
      .subscribe((responseData) => {
        // console.log(responseData);
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === postId);
        const post: Post = {
          id: postId,
          title: title,
          content: content,
          imagePath: '', //responseData.imagePath
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete<{ message: string }>('http://localhost:3000/api/posts/' + postId)
      .subscribe((responseData) => {
        // console.log(responseData.message);
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
