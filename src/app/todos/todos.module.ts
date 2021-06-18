import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BypassSanitizerPipe } from '../utils/bypasssanitizerpipe';
import { QuillModule } from 'ngx-quill';
import { MaterialModule } from './../material.module';
import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoListComponent } from './todo-list/todo-list.component';

@NgModule({
    declarations: [
        TodoListComponent,
        TodoCreateComponent,
        BypassSanitizerPipe
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        QuillModule.forRoot(),
        RouterModule
    ]
})
export class TodosModule {}