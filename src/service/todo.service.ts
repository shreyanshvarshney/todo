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

  constructor(private http: HttpClient, private alertService: AlertService, private router: Router) { } 

  getTodos() {
    return this.http.get<{message: string, todos: Todo[]}>(TodoApis.getTodosApi)
    .pipe(
      map((response) => {
        return response.todos.map((res: any) => {
          return {
            id: res._id,
            title: res.title,
            content: res.content,
            dateCreated: res.dateCreated,
            dateUpdated: res.dateUpdated,
            updated: res.updated
          };
        });
      }),
    );
  }

  postTodo(data: Todo) {
    return this.http.post<{message: string, todoId: string}>(TodoApis.getTodosApi, data);
  }

  deleteTodo(todoId: string) {
    return this.http.delete<{message: string}>(TodoApis.deleteTodoApi + todoId);
  }

  getTodo(todoId: string) {
    return this.http.get<{todo: Todo}>(TodoApis.getTodoApi + todoId)
    .pipe(
      map((res: any) => {
        return {
          id: res.todo._id,
          title: res.todo.title,
          content: res.todo.content,
          dateCreated: res.todo.dateCreated,
          dateUpdated: res.dateUpdated,
          updated: res.updated
        };
      }),
    );
  }

  updateTodo(data: Todo, todoId: string) {
    return this.http.patch<{message: string}>(TodoApis.updateTodoApi + todoId, data);
  }

}
