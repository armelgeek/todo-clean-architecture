import { Todo } from '@/core/domain/entities/todo.entity';

export interface TodoRepositoryInterface {
    createTodo(todo: Todo.CreateTodoDto): Promise<Todo.CreateTodoResponse>;
    getTodos(): Promise<Todo.GetTodosResponse>;
    updateTodo(todo: Todo.UpdateTodoDto): Promise<Todo.UpdateTodoResponse>;
    deleteTodo(params: Todo.DeleteTodoDto): Promise<Todo.DeleteTodoResponse>;
}
