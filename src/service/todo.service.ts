import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';

import { Todo } from './../data-models/todo.model';
import { TodoApis } from './../app/apis/apis';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todos: Todo[] = [];
  // I have made this subject private becoz I dont want that other components to emit data(call next() method of this subject).
  private todosUpdate = new Subject<Todo[]>();

  constructor(private http: HttpClient, private alertService: AlertService, private router: Router) { } 

  // This is of no use now, after Implementing Subject rxjs operator.
  getTodos() {
    // return [...this.todos];
    this.http.get<{message: string, todos: Todo[]}>(TodoApis.getTodosApi)
    .pipe(
      map((response) => {
        return response.todos.map((res: any) => {
          return {
            id: res._id,
            title: res.title,
            content: res.content,
            dateCreated: res.dateCreated
          };
        });
      }),
    )
    .subscribe((res) => {
      console.log(res);
      this.todos = res;
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
    this.http.post<{message: string, todoId: string}>(TodoApis.getTodosApi, data)
    .subscribe((res) => {
      console.log(res.message);
      // Objects in TS are refrenece types so I can access object properties and update them.
      data.id = res.todoId;
      this.todos.push(data);
      this.todosUpdate.next([...this.todos]);
      this.alertService.openSnackBar("Added Successfully");
      this.router.navigate(['/']);
    });
  }

  deleteTodo(item: Todo) {
    this.http.delete<{message: string}>(TodoApis.deleteTodoApi + item.id)
    .subscribe((data) => {
      console.log(data.message)
      this.alertService.openSnackBar("Deleted Successfully");
    });

    const todoIndex = this.todos.indexOf(item,0);
    this.todos.splice(todoIndex,1);
    this.todosUpdate.next([...this.todos]);
  }

  getTodo(todoId: string) {
    return this.http.get<{todo: Todo}>(TodoApis.getTodoApi + todoId)
    .pipe(
      map((res: any) => {
        return {
          id: res.todo._id,
          title: res.todo.title,
          content: res.todo.content,
          dateCreated: res.todo.dateCreated
        };
      }),
    );
  }

  updateTodo(data: Todo, todoId: string) {
    // console.log(data);
    data.id = todoId;
    return this.http.patch<{message: string}>(TodoApis.updateTodoApi + todoId, data);
  }

}
