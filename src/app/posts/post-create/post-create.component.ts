import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { Post } from '../post.model';
// import { NgForm } from "@angular/forms"
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  // Form alternativ zu ngModel mit ReactiveFormModel
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;

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
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  // Subscribes die innerhalb dieser Angular-Methoden gemacht werden, müssen nicht gecancelt werden, da sie von Angular verwaltet werden.
  ngOnInit() {
    // console.log("onInit");
    this.form = new FormGroup({
      // herausfinden, wie steuere, ob die Validierung bei Änderung oder bei verlassen der Form stattfinden soll
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'change',
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)],
        updateOn: 'change',
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
        updateOn: 'change',
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        // console.log(this.mode);
        this.postId = paramMap.get('postId');
        //hier Spinner
        this.isLoading = true;
        //
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
          //hier Spinner aufhören
          this.isLoading = false;
          this.post = {
            id: postData.post._id,
            title: postData.post.title,
            content: postData.post.content,
            imagePath: null,
          };
          // console.log(this.post);
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: null,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        // console.log(this.mode);
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file,
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    // console.log(file);
    // console.log(this.form);
  }

  // onSavePost(form: NgForm){
  onSavePost() {
    // console.log(this.mode);
    // if (form.invalid){
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true; //muss nicht auf false gesetzt werden,d a wegnavigiere.
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
      // console.log('update');
    }
    // const post: Post = {
    //     title: form.value.title,
    //     content: form.value.content
    // }
    // this.postCreated.emit(post);

    // form.resetForm();
    this.form.reset();
  }
}
