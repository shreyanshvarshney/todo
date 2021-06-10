import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/service/todo.service';
import { Todo } from './../../../data-models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todos: Todo[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    // Everytime the next() method of Subject is called (any changes occures) in todo-service todos array,
    // we will be notified here and angular change detection mechanism will updated the ui accordingly.
    this.todoService.getTodosUpdateListener()
    .subscribe((res) => {
      this.todos = res;
    });
    this.todoService.getTodos();
  }

  deleteTodo(item: Todo) {
    this.todoService.deleteTodo(item);
  }

}
