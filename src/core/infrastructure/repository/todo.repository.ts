import { TodoRepositoryInterface } from '../../application/repositories/todo.repository.interface';
import { Todo } from '../../domain/entities/todo.entity';
import { get, post, put, remove } from '../helpers/rest.helpers';

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

	async getTodos(): Promise<Todo.GetTodosResponse> {
		const response = await get<Todo.GetTodosResponse>({ path: 'todo/list' });
		return response;
	}

	async updateTodo(todo: Todo.UpdateTodoDto): Promise<Todo.UpdateTodoResponse> {
		const response = await put<Todo.UpdateTodoResponse, Todo.UpdateTodoDto>({
			path: `todo/${todo.id}`,
			payload: todo
		});
		return response;
	}

	async deleteTodo(params: Todo.DeleteTodoDto): Promise<Todo.DeleteTodoResponse> {
		const response = await remove<Todo.DeleteTodoResponse>({
			path: `todo/${params.id}`
		});
		return response;
	}
}

export const todoRepository = new TodoRepository();
