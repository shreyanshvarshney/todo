import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TodoService } from 'src/service/todo.service';
import { Todo } from './../../../data-models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todos: Todo[] = [];
  isLoading = false;

  constructor(private todoService: TodoService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.todoService.getTodos();
    // Everytime the next() method of Subject is called (any changes occures) in todo-service todos array,
    // we will be notified here and angular change detection mechanism will updated the ui accordingly.
    this.todoService.getTodosUpdateListener()
    .subscribe((res) => {
      this.isLoading = false;
      this.todos = res;
    });
    
  }

  deleteTodo(item: Todo) {
    this.todoService.deleteTodo(item);
  }

  updateTodo(item: Todo) {
    this.router.navigate(['/update',item.id]);
  }

}
