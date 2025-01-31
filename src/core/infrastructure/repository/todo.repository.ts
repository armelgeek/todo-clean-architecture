import { TodoRepositoryInterface } from '../../application/repositories/todo.repository.interface';
import { Todo } from '../../domain/entities/todo.entity';
import { post } from '../helpers/rest.helpers';

export class TodoRepository implements TodoRepositoryInterface {
	async createTodo(todo: Todo.CreateTodoDto): Promise<Todo.CreateTodoResponse> {
		const response = await post<Todo.CreateApiTodoResponse, Todo.CreateTodoDto>({
			path: 'todo/create',
			payload: todo
		});

		if (!response?.data) {
			return {
				success: false,
				data: null,
				error: response?.error || 'No data received',
				metadata: null
			};
		}

		return {
			success: response.success,
			data: Todo.toEntity(response.data),
			error: response.error,
			metadata: response.metadata
		};
	}
}

export const todoRepository = new TodoRepository();
