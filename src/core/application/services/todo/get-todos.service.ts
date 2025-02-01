import { todoRepository } from '@/core/infrastructure/repository/todo.repository';
import { Todo } from '@/core/domain/entities/todo.entity';
import { GetTodosUseCase } from '../../use-cases/todo/get-todos.use-case';

export class GetTodosService implements GetTodosUseCase {
	async execute(): Promise<Todo.GetTodosResponse> {
		return todoRepository.getTodos();
	}
}
