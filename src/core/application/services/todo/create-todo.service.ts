import { Todo } from '../../../domain/entities/todo.entity';
import { TodoRepository } from '../../../infrastructure/repository/todo.repository';
import { CreateTodoUseCase } from '../../use-cases/todo/create-todo.use-case';

export class CreateTodoService implements CreateTodoUseCase {
	private readonly todoRepository: TodoRepository = new TodoRepository();

    execute(todo: Todo.CreateTodoDto): Promise<Todo.CreateTodoResponse> {
        return this.todoRepository.createTodo(todo);
    }
}
