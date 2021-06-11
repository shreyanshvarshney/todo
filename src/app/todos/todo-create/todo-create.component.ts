import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
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
              private sanitizer: DomSanitizer,
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
      image: new FormControl(null, Validators.required)
    });
  }

  saveTodo(form: FormGroup) {
    if (form.valid) {
      if(!this.todoId) {
        const obj = {
          ...form.value,
          dateCreated: new Date()
        }
        this.todoService.addTodo(obj);
        form.reset();
      } else {
        this.todoService.updateTodo(form.value, this.todoId)
        .subscribe((result) => {
          console.log(result.message);
          this.alertService.openSnackBar("Updated Successfully.");
          this.router.navigate(['/']);
        });
      }
    } else {
      alert('Please enter all required deatails.');
    }
  }

  loadTodoData() {
    this.isLoading = true;
    this.todoService.getTodo(this.todoId)
    .subscribe((result) => {
      // console.log(result);
      this.todoData = result;
      this.isLoading = false;
      this.prefillForm(result);
    });
  }

  prefillForm(data: Todo) {
    this.todoForm.controls.title.setValue(data?.title);
    this.todoForm.controls.content.setValue(data?.content);
  }

  fileChangeEvent(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.todoForm.controls.image.setValue(file);
    console.log(URL.createObjectURL(file));
    this.imagePreview = URL.createObjectURL(file);
  }

  getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  get title() {
    return this.todoForm.get('title');
  }

  get content() {
    return this.todoForm.get('content');
  }

}
