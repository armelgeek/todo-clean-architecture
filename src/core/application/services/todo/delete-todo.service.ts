import { todoRepository } from '@/core/infrastructure/repository/todo.repository';
import { Todo } from '@/core/domain/entities/todo.entity';
import { DeleteTodoUseCase } from '../../use-cases/todo/delete-todo.use-case';

export class DeleteTodoService implements DeleteTodoUseCase {
	async execute(params: Todo.DeleteTodoDto): Promise<Todo.DeleteTodoResponse> {
		return todoRepository.deleteTodo(params);
	}
}
