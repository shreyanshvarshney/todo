import { RouterModule, Routes } from '@angular/router';
import { NgModule } from "@angular/core";

import { AuthGuard } from './../../guards/auth.guard';
import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoListComponent } from './todo-list/todo-list.component';

const routes: Routes = [
    {
        path: 'list',
        component: TodoListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Todo List Page'
        }
    },
    {
        path: 'create',
        component: TodoCreateComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Todo Create Page'
        }
    },
    {
        path: 'update/:id',
        component: TodoCreateComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TodosRoutingModule {}