import { Component, OnInit } from '@angular/core';
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

  constructor(private todoService: TodoService, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos() {
    this.isLoading = true;
    this.todoService.getTodos().subscribe((res) => {      
      this.isLoading = false;
      this.todos = res;
    });
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

}
