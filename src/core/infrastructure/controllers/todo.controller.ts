import { TodoRepositoryInterface } from '../../application/repositories/todo.repository.interface';
import { CreateTodo } from '../../application/use-cases/todo/create-todo.use-case';
import { GetTodos } from '../../application/use-cases/todo/get-todos.use-case';
import { UpdateTodo } from '../../application/use-cases/todo/update-todo.use-case';
import { DeleteTodo } from '../../application/use-cases/todo/delete-todo.use-case';
import { Todo } from '@/core/domain/entities/todo.entity';
import { TodoRepository, todoRepository } from '../repository/todo.repository';

export class TodoController {
	private readonly todoRepository: TodoRepositoryInterface;
	private readonly createTodoUseCase: CreateTodo;
	private readonly getTodosUseCase: GetTodos;
	private readonly updateTodoUseCase: UpdateTodo;
	private readonly deleteTodoUseCase: DeleteTodo;

	constructor() {
		this.todoRepository = new TodoRepository();
		this.createTodoUseCase = new CreateTodo(this.todoRepository);
		this.getTodosUseCase = new GetTodos(this.todoRepository);
		this.updateTodoUseCase = new UpdateTodo(this.todoRepository);
		this.deleteTodoUseCase = new DeleteTodo(this.todoRepository);
	}

	async create(params: Todo.CreateTodoDto) {
		return this.createTodoUseCase.execute(params);
	}

	async getAll() {
		return this.getTodosUseCase.execute();
	}

	async update(params: Todo.UpdateTodoDto) {
		return this.updateTodoUseCase.execute(params);
	}

	async delete(params: Todo.DeleteTodoDto) {
		return this.deleteTodoUseCase.execute(params);
	}
}
