import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TodoService } from './../../../service/todo.service';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit {

  todoForm: FormGroup;

  constructor(private fb: FormBuilder, private todoService: TodoService) { }

  ngOnInit(): void {
    this.initailizeForm();
  }

  initailizeForm() {
    this.todoForm = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      content: new FormControl('', Validators.required)
    });
  }

  addTodo(form: FormGroup) {
    if (form.valid) {
      const obj = {
        ...form.value,
        dateCreated: new Date()
      }
      this.todoService.addTodo(obj);
      form.reset();
    } else {
      alert('Please enter all required deatails.');
    }
  }

  get title() {
    return this.todoForm.get('title');
  }

  get content() {
    return this.todoForm.get('content');
  }

}
