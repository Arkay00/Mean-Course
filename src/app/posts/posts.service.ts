import { Injectable } from '@angular/core';
import { Post } from './post.model'
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';//for mapping within observable

@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>()

    constructor(private http: HttpClient) {}

    getPosts(){
        // return [...this.posts];
        this.http
            // .get<{message: string, posts: Post[]}>
                .get<{message: string, posts: any}>
                ('http://localhost:3000/api/posts')
                // pipe accepts multiple operators within observable
                .pipe(map((postData) => {
                    return postData.posts.map((post) => {
                        return {
                            id: post._id,
                            title: post.title,
                            content: post.content
                        }
                    })
                }))
                .subscribe(transformedPosts => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }


    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string){
        const post: Post = {id: null, title: title, content: content};
        this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
            .subscribe( (responseData) => {
                console.log(responseData.message);
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
    }

    deletePost(postId: string){
        this.http.delete<{message: string}>('http://localhost:3000/api/posts/' + postId)
            .subscribe((responseData) => {
                console.log(responseData.message);
                
            });
    }
}