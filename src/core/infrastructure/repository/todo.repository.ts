import { TodoRepositoryInterface } from '../../application/repositories/todo.repository.interface';
import { Todo } from '../../domain/entities/todo.entity';
import { post } from '../helpers/rest.helpers';

export class TodoRepository implements TodoRepositoryInterface {
    async createTodo(todo: Todo.CreateTodoDto): Promise<Todo.CreateTodoResponse> {
		const response = await post<Todo.CreateTodoResponse, Todo.CreateTodoDto>({
			path: 'todo/create',
			payload: todo
		});
        return response;
    }
}
