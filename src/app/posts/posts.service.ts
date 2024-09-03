import { Injectable } from '@angular/core';
import { Post } from './post.model'

@Injectable({providedIn: 'root'})
export class PostListComponent{
    private posts: Post[] = [];

    getPosts(){
        [...this.posts];
    }

    addPost(title: string, content: string){
        const post: Post = {title: title, content: content}
        this.posts.push(post)
    }
}