import { Injectable } from '@angular/core';
import { Post } from './post.model'
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';//for mapping within observable
import { response } from 'express';

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

    getPost(id: string){
        return {...this.posts.find(post => post.id === id)};
    }

    addPost(title: string, content: string){
        const post: Post = {id: null, title: title, content: content};
        this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
            .subscribe( (responseData) => {
                // console.log(responseData.message);
                const id = responseData.postId;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
    }

    updatePost(postId: string, title: string, content: string){
        const post: Post = {id: postId, title: title, content: content};
        this.http.put<{message: string}>('http://localhost:3000/api/posts/' + postId, post)
            .subscribe( (responseData) => {
                console.log(responseData);
            });
    }

    deletePost(postId: string){
        this.http.delete<{message: string}>('http://localhost:3000/api/posts/' + postId)
            .subscribe((responseData) => {
                console.log(responseData.message);
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }
}