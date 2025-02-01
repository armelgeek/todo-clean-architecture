import { Todo } from '@/core/domain/entities/todo.entity';
import { TodoRepositoryInterface } from '../../repositories/todo.repository.interface';

export interface GetTodosUseCase {
	execute(): Promise<GetTodosUseCase.Result>;
}

export namespace GetTodosUseCase {
	export type Result = Todo.GetTodosResponse;
}

export class GetTodos implements GetTodosUseCase {
	constructor(private readonly todoRepository: TodoRepositoryInterface) { }

	async execute(): Promise<GetTodosUseCase.Result> {
		return this.todoRepository.getTodos();
	}
}
