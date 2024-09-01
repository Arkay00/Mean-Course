import { Component, EventEmitter, Output } from "@angular/core";
import { Post } from '../post.model';
import { NgForm } from "@angular/forms"

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent{
    enteredTitle = '';
    enteredContent = '';
    @Output() postCreated = new EventEmitter<Post>();
    // newPost = 'No Content';
    // onAddPost(){
    //     // console.dir(postInput.value);
    //     // this.newPost = this.enteredValue;
    //     const post: Post = {
    //         title: this.enteredTitle,
    //         content: this.enteredContent
    //     }
    //     this.postCreated.emit(post);
    // }
        onAddPost(form: NgForm){
        if (form.invalid){
            return;
        }
        const post: Post = {
            title: form.value.title,
            content: form.value.content
        }
        this.postCreated.emit(post);
    }
}