import { environment } from './../../environments/environment';


export const TodoApis = {
    getTodosApi: environment.baseUrl + 'api/todos/',
    postTodosApi: environment.baseUrl + 'api/todos',
    deleteTodoApi: environment.baseUrl + 'api/todo/',
    getTodoApi: environment.baseUrl + 'api/todo/',
    updateTodoApi: environment.baseUrl + 'api/todo/',
    deleteTodosApi: environment.baseUrl + 'api/todos',
    imageUploadApi: environment.baseUrl + 'api/upload',
};