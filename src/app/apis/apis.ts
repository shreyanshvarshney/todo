import { environment } from './../../environments/environment';


export const TodoApis = {
    getTodosApi: environment.baseUrl + 'api/todos',
    deleteTodoApi: environment.baseUrl + 'api/todo/',
    getTodoApi: environment.baseUrl + 'api/todo/',
    updateTodoApi: environment.baseUrl + 'api/todo/',
};