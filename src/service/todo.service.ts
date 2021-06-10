import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Todo } from './../data-models/todo.model';
import { TodoApis } from './../app/apis/apis';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todos: Todo[] = [];
  // I have made this subject private becoz I dont want that other components to emit data(call next() method of this subject).
  private todosUpdate = new Subject<Todo[]>();

  constructor(private http: HttpClient) {
    this.http.get(TodoApis.getTodosApi).subscribe(data => console.log(data));
  } 

  // This is of no use now, after Implementing Subject rxjs operator.
  getTodos() {
    // return [...this.todos];
    this.http.get<{message: string, todos: Todo[]}>(TodoApis.getTodosApi)
    .subscribe((res) => {
      this.todos = res.todos;
      this.todosUpdate.next([...this.todos]);
    });
  }

  getTodosUpdateListener() {
    // Returning asObservable so that any component can only subscribe to this Observable.
    return this.todosUpdate.asObservable();
  }

  addTodo(data: Todo) {
    // Emitting an event using Subject or Behaviourial Subject.
    // Emitting data array as a copy of original todo array becoz to avoid unnecessary data manupulation.
    // this.todosUpdate.next([...this.todos]);

    // Will add the id property in my backend.
    this.http.post<{message:string}>(TodoApis.getTodosApi, data)
    .subscribe((res) => {
      console.log(res.message);
      this.todos.push(data);
      this.todosUpdate.next([...this.todos]);
    });
  }

  deleteTodo(item: Todo) {
    const todoIndex = this.todos.indexOf(item,0);
    this.todos.splice(todoIndex,1);
    this.todosUpdate.next([...this.todos]);
  }

}
