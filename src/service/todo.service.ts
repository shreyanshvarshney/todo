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

  getTodos(pageSize: number, pageIndex: number) {
    const queryParams = `?pageSize=${pageSize}&pageIndex=${pageIndex + 1}`;
    return this.http.get<{message: string, todos: Todo[], count: number}>(TodoApis.getTodosApi + queryParams)
    .pipe(
      map((response) => {
        return {
          todos: response.todos.map((res: any) => {
            return {
              id: res._id,
              title: res.title,
              content: res.content,
              dateCreated: res.dateCreated,
              dateUpdated: res.dateUpdated,
              updated: res.updated,
              imagePath: res.imagePath
            };
          }),
          count: response.count
        }
      }),
    );
  }

  postTodo(data) {
    return this.http.post<{message: string, todoId: string}>(TodoApis.getTodosApi, data);
  }

  deleteTodo(todoId: string) {
    return this.http.delete<{message: string}>(TodoApis.deleteTodoApi + todoId);
  }

  deleteAllTodos() {
    return this.http.delete<{message: string}>(TodoApis.deleteTodosApi);
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
          dateUpdated: res.todo.dateUpdated,
          updated: res.todo.updated,
          imagePath: res.todo.imagePath
        };
      }),
    );
  }

  updateTodo(data: Todo, todoId: string) {
    return this.http.patch<{message: string}>(TodoApis.updateTodoApi + todoId, data);
  }

  uploadTodoImage(data: FormData) {
    return this.http.post<{message: string}>(TodoApis.imageUploadApi, data);
  }

}
