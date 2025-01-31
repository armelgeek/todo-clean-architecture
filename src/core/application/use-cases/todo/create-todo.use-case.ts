import { Todo } from '@/core/domain/entities/todo.entity';

export interface CreateTodoUseCase {
    execute(todo: Todo.CreateTodoDto): Promise<Todo.CreateTodoResponse>;
}
