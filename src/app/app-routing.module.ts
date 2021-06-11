import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodoListComponent } from './todos/todo-list/todo-list.component';
import { TodoCreateComponent } from './todos/todo-create/todo-create.component';

const routes: Routes = [
  {
    path: '',
    component: TodoListComponent,
    data: {
      title: 'Todo List Page'
    }
  },
  {
    path: 'create',
    component: TodoCreateComponent,
    data: {
      title: 'Todo Create Page'
    }
  },
  {
    path: 'update/:id',
    component: TodoCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
