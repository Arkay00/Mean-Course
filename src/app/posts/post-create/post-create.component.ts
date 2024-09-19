import { Component, EventEmitter, OnInit, Output } from "@angular/core";
// import { Post } from '../post.model';
import { NgForm } from "@angular/forms"
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
    enteredTitle = '';
    enteredContent = '';
    private mode = 'create';
    private postId: string;
    post: Post;
    // @Output() postCreated = new EventEmitter<Post>();
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
    constructor(public postsService: PostsService, public route: ActivatedRoute){}

    // Subscribes die innerhalb dieser Angular-Methoden gemacht werden, müssen nicht gecancelt werden, da sie von Angular verwaltet werden.
    ngOnInit(){
        // console.log("onInit");
        this.route.paramMap.subscribe( (paramMap: ParamMap) => {
            if (paramMap.has('postId')){
                this.mode = 'edit';
                // console.log(this.mode);
                this.postId = paramMap.get('postId');
                // this.post = this.postsService.getPost(this.postId);
                // this.postsService.getPost(this.postId).subscribe(postData => {
                //     console.log(postData);
                //     this.post = {
                //         id: postData.post._id,
                //         title: postData.post.title,
                //         content: postData.post.content
                //     }
                //     // console.log(this.postId);
                // });
                this.postsService.getPost(this.postId).subscribe((postData) => {
                    this.post = {id: postData.post._id, title: postData.post.title, content: postData.post.content};
                })
                }
            else {
                this.mode = 'create';
                this.postId = null;
                // console.log(this.mode);
            }
        });
    }

    onSavePost(form: NgForm){
        console.log(this.mode);
        if (form.invalid){
            return;
        }
        if (this.mode === 'create'){
            this.postsService.addPost(form.value.title, form.value.content);
        }
        else{
            this.postsService.updatePost(this.postId, form.value.title, form.value.content)
            // console.log('update');
        }
        // const post: Post = {
        //     title: form.value.title,
        //     content: form.value.content
        // }
        // this.postCreated.emit(post);
        
        form.resetForm();
    }
}