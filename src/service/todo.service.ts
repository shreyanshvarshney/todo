import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Todo } from './../data-models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todos: Todo[] = [];
  // I have made this subject private becoz I dont want that other components to emit data(call next() method of this subject).
  private todosUpdate = new Subject<Todo[]>();

  constructor() { } 

  // This is of no use now, after Implementing Subject rxjs operator.
  getTodos() {
    return [...this.todos];
  }

  getTodosUpdateListener() {
    // Returning asObservable so that any component can only subscribe to this Observable.
    return this.todosUpdate.asObservable();
  }

  addTodo(data: Todo) {
    this.todos.push(data);
    // Emitting an event using Subject or Behaviourial Subject.
    // Emitting data array as a copy of original todo array becoz to avoid unnecessary data manupulation.
    this.todosUpdate.next([...this.todos]);
  }

  deleteTodo(item: Todo) {
    const todoIndex = this.todos.indexOf(item,0);
    this.todos.splice(todoIndex,1);
    this.todosUpdate.next([...this.todos]);
  }

}
