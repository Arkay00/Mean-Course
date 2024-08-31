import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent{
    enteredTitle = '';
    enteredContent = '';
    @Output() postCreated = new EventEmitter();
    // newPost = 'No Content';
    onAddPost(){
        // console.dir(postInput.value);
        // this.newPost = this.enteredValue;
        const post = {
            title: this.enteredTitle,
            content: this.enteredContent
        };
        this.postCreated.emit(post);
    }
}