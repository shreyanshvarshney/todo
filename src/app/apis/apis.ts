import { environment } from './../../environments/environment';


export const TodoApis = {
    getTodosApi: environment.baseUrl + 'todos/',
    postTodosApi: environment.baseUrl + 'todos',
    deleteTodoApi: environment.baseUrl + 'todos/',
    getTodoApi: environment.baseUrl + 'todos/',
    updateTodoApi: environment.baseUrl + 'todos/',
    deleteTodosApi: environment.baseUrl + 'todos',
    imageUploadApi: environment.baseUrl + 'upload',

    signupApi: environment.baseUrl + 'user/signup',
    loginApi: environment.baseUrl + 'user/login'
};