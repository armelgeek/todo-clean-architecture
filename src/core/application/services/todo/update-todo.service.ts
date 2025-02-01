import { todoRepository } from '@/core/infrastructure/repository/todo.repository';
import { Todo } from '@/core/domain/entities/todo.entity';
import { UpdateTodoUseCase } from '../../use-cases/todo/update-todo.use-case';

export class UpdateTodoService implements UpdateTodoUseCase {
	async execute(todo: Todo.UpdateTodoDto): Promise<Todo.UpdateTodoResponse> {
		return todoRepository.updateTodo(todo);
	}
}
