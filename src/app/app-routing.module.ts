import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodoListComponent } from './todos/todo-list/todo-list.component';
import { TodoCreateComponent } from './todos/todo-create/todo-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

import { AuthGuard } from './../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'todos',
    component: TodoListComponent,
    data: {
      title: 'Todo List Page'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: TodoCreateComponent,
    data: {
      title: 'Todo Create Page'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'update/:id',
    component: TodoCreateComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
