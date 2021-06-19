import { environment } from './../../environments/environment';


export const TodoApis = {
    getTodosApi: environment.baseUrl + 'api/todos/',
    postTodosApi: environment.baseUrl + 'api/todos',
    deleteTodoApi: environment.baseUrl + 'api/todos/',
    getTodoApi: environment.baseUrl + 'api/todos/',
    updateTodoApi: environment.baseUrl + 'api/todos/',
    deleteTodosApi: environment.baseUrl + 'api/todos',
    imageUploadApi: environment.baseUrl + 'api/upload',

    signupApi: environment.baseUrl + 'api/user/signup',
    loginApi: environment.baseUrl + 'api/user/login'
};