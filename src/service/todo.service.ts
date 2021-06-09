import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Todo } from './../data-models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todos: Todo[] = [];

  constructor() { } 

  getTodos() {
    return this.todos;
  }

  addTodo(data: Todo) {
    this.todos.push(data);
  }
}
