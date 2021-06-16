import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AlertService } from 'src/service/alert.service';

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

  length = 0; // totalTodos
  pageSize = 4; // todosPerPage
  pageIndex = 0; // Current Page (starting with 0)
  pageSizeOptions = [1, 2, 5, 10];

  constructor(private todoService: TodoService, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos() {
    this.isLoading = true;
    this.todoService.getTodos(this.pageSize, this.pageIndex).subscribe((res) => {
      // console.log(res);
      this.isLoading = false;
      this.todos = res.todos;
      this.length = res.count;
    });
  }

  onChangedPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getTodos();
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id)
    .subscribe((res) => {
      this.getTodos();
      console.log(res.message);
      this.alertService.openSnackBar("Deleted Successfully");
    });
  }

  updateTodo(item: Todo) {
    this.router.navigate(['/update',item.id]);
  }

  deleteAllTodos() {
    this.todoService.deleteAllTodos()
    .subscribe((res) => {
      this.getTodos();
      console.log(res.message);
      this.alertService.openSnackBar("Deleted all your todos Successfully");
    });
  }

}
