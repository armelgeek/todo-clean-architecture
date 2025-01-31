import { Todo } from '../../domain/entities/todo.entity';

export interface TodoRepositoryInterface {
    createTodo(todo: Todo.CreateTodoDto): Promise<Todo.CreateTodoResponse>;
}
