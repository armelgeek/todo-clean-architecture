import { Todo } from '../../../domain/entities/todo.entity';
import { todoRepository } from '../../../infrastructure/repository/todo.repository';
import { CreateTodoUseCase } from '../../use-cases/todo/create-todo.use-case';

export class CreateTodoService implements CreateTodoUseCase {
    execute(todo: Todo.CreateTodoDto): Promise<Todo.CreateTodoResponse> {
        return todoRepository.createTodo(todo);
    }
}

export const createTodoService = new CreateTodoService();
