import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodoCreateComponent } from './todos/todo-create/todo-create.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'todo/create',
    pathMatch: 'full'
  },
  {
    path: 'todo/create',
    component: TodoCreateComponent,
    data: {
      title: 'Todo Create Page'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
