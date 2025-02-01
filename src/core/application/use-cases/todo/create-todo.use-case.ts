import { Todo } from '@/core/domain/entities/todo.entity';
import { TodoRepositoryInterface } from '../../repositories/todo.repository.interface';

export interface CreateTodoUseCase {
	execute(params: CreateTodoUseCase.Params): Promise<CreateTodoUseCase.Result>;
}

export namespace CreateTodoUseCase {
	export type Params = Todo.CreateTodoDto;
	export type Result = Todo.CreateTodoResponse;
}

export class CreateTodo implements CreateTodoUseCase {
	constructor(private readonly todoRepository: TodoRepositoryInterface) { }

	async execute(params: CreateTodoUseCase.Params): Promise<CreateTodoUseCase.Result> {
		return this.todoRepository.createTodo(params);
	}
}
