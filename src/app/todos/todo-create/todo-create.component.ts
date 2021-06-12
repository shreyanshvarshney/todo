import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { TodoService } from './../../../service/todo.service';
import { AlertService } from './../../../service/alert.service';
import { Todo } from './../../../data-models/todo.model';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit {

  todoForm: FormGroup;
  todoId: string;
  private todoData: Todo;
  isLoading = false;

  imagePreview: string;

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
    this.initailizeForm();
    if (this.todoId !== null && this.todoId) {
      this.loadTodoData();
    }
  }

  initailizeForm() {
    this.todoForm = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      content: new FormControl('', Validators.required),
      image: new FormControl(null)
    });
  }

  saveTodo(form: FormGroup) {
    if (form.valid) {
      if(!this.todoId) {
        const obj = {
          ...form.value,
          dateCreated: new Date(),
          updated: false,
          dateUpdated: new Date()
        };
        this.todoService.postTodo(obj)
        .subscribe((res) => {
          console.log(res.message);
          this.alertService.openSnackBar("Added Successfully");
          form.reset();
          this.router.navigate(['/']);
        });
      } else {
        const obj = {
          ...form.value,
          updated: true,
          dateUpdated: new Date()
        };
        this.todoService.updateTodo(obj, this.todoId)
        .subscribe((res) => {
          console.log(res.message);
          this.alertService.openSnackBar("Updated Successfully.");
          this.router.navigate(['/']);
        });
      }
    } else {
      this.alertService.openSnackBar("Please enter all required deatails.", 4000);
    }
  }

  loadTodoData() {
    this.isLoading = true;
    this.todoService.getTodo(this.todoId)
    .subscribe((res) => {
      // console.log(res);
      this.todoData = res;
      this.isLoading = false;
      this.prefillForm(res);
    });
  }

  prefillForm(data: Todo) {
    this.todoForm.controls.title.setValue(data?.title);
    this.todoForm.controls.content.setValue(data?.content);
  }

  fileChangeEvent(event: Event) {
    console.log((event.target as HTMLInputElement).files);
    
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file.type, Math.floor(file.size/1000));
    if(Math.floor(file.size/1000) > 20) {
      console.log(Error("Image size is big."));
    }
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
