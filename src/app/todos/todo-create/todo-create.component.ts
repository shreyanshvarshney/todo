import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TodoService } from './../../../service/todo.service';
import { AlertService } from './../../../service/alert.service';
import { Todo } from './../../../data-models/todo.model';
import { Observable } from 'rxjs';
import { modules } from '../../utils/quillEditorConfig';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit {

  todoForm: FormGroup;
  todoId: string;
  todoData: Todo;
  isLoading = false;

  imagePreview: string;
  // Quill Editor config
  modules = modules;

  constructor(private route: ActivatedRoute, 
              private todoService: TodoService, 
              private fb: FormBuilder,
              private alertService: AlertService,
              private router: Router) {
                this.route.paramMap.pipe(
                  take(1)
                ).subscribe((params: ParamMap) => {
                  if (params.has('id')) {
                    this.todoId = params.get('id')
                  } else this.todoId = null;
                  // console.log(params);
                });
              }

  ngOnInit(): void {
    this.initializeForm();
    if (this.todoId !== null && this.todoId) {
      this.loadTodoData();
    }
  }

  initializeForm() {
    this.todoForm = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      content: new FormControl('', Validators.required),
      image: new FormControl(null)
    });
  }

  saveTodo(form: FormGroup) {
    if (form.valid) {
      this.isLoading = true;
      if(!this.todoId) {
        console.log(form.value);
        const obj = {
          title: form.controls.title.value,
          content: form.controls.content.value
          // Not sending the image form control to server.
        };
        this.todoService.postTodo(obj)
        .subscribe((res) => {
          console.log(res.message);
          if (this.todoForm.controls.image.value) {
            this.uploadImage(res.todoId);
          }
          else {
            this.isLoading = false;
            this.alertService.openSnackBar("Added Successfully");
            this.todoForm.reset();
            this.router.navigate(['/todos/list']);
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(error);
          this.alertService.openErrorDialog(error.error.message);
        });
      } else {
        this.isLoading = true;
        let finalData = this.prepateUpdateAttributes(form);
        console.log(finalData);
        this.todoService.updateTodo(finalData, this.todoId)
        .subscribe((res) => {
          console.log(res.message);
          if (form.controls.image.value !== null) {
            this.uploadImage(this.todoData.id);
          }
          else {
            this.isLoading = false;
            this.alertService.openSnackBar("Updated Successfully.");
            this.router.navigate(['/todos/list']);
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(error);
          this.alertService.openErrorDialog(error.error.message);
        });
      }
    } else {
      Object.keys(this.todoForm.controls).forEach(field => {
        const control = this.todoForm.get(field);
        control.markAsTouched({onlySelf: true});
      });
      this.alertService.openSnackBar("Please enter all required deatails.", 4000);
    }
  }

  uploadImage(todoId: string) {
    // FormData is a data format which allows me to combine text values and Blob (file values).
    const todoData = new FormData();
    todoData.append('id', todoId);
    todoData.append('image', this.todoForm.controls.image.value, this.todoForm.controls.title.value);
    this.todoService.uploadTodoImage(todoData)
    .subscribe((res) => {
      this.isLoading = false;
      console.log(res.message);
      if (this.todoData) {
        this.alertService.openSnackBar("Updated Successfully.");
      }
      else {
        this.alertService.openSnackBar("Added Successfully");
        this.todoForm.reset();
      }
      this.router.navigate(['/todos/list']);
    },
    (error: HttpErrorResponse) => {
      this.isLoading = false;
      console.log(error);
      this.alertService.openErrorDialog(error.error.message);
    });
  }

  prepateUpdateAttributes(form: FormGroup) {
    return {
      // ...this.todoData,
      // This will overwrite the exsisting values, functionality of spread operator.
      // Can also write ...form.value
      title: form.controls.title.value,
      content: form.controls.content.value,
      imagePath: this.todoData.imagePath,
      // id: "", // Send todo id by route parameter to the server
      // dateUpdated: "", // Not assigning dateUpdated any value, becoz managing it on the server, assigning null value to maintain Todo model
      // updated: true, // Not assigning updated any value, becoz managing it on the server
      // userId: "", // Not sending the userId/creator of this todo from client as it can be manupulated, taking it from auth token on server
      // dateCreated: "" // Already on my server
    };
  }

  loadTodoData() {
    this.isLoading = true;
    this.todoService.getTodo(this.todoId)
    .subscribe((res) => {
      // console.log(res);
      this.todoData = res;
      this.isLoading = false;
      this.prefillForm(res);
    },
    (error: HttpErrorResponse) => {
      this.isLoading = false;
      console.log(error);
      this.alertService.openErrorDialog(error.error.message);
    });
  }

  prefillForm(data: Todo) {
    this.todoForm.controls.title.setValue(data?.title);
    this.todoForm.controls.content.setValue(data?.content);
  }

  fileChangeEvent(event: Event) {
    console.log((event.target as HTMLInputElement).files);
    
    const file = (event.target as HTMLInputElement).files[0];
    // console.log(file.type, Math.floor(file.size/1000));
    // if(Math.floor(file.size/1000) > 20) {
    //   console.log(Error("Image size is big."));
    // }
    this.todoForm.controls.image.setValue(file);
    const reader = new FileReader();
    reader.onload = () => {      
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);    
  }

  get title() {
    return this.todoForm.get('title');
  }

  get content() {
    return this.todoForm.get('content');
  }

  get image() {
    return this.todoForm.get('image');
  }

}
